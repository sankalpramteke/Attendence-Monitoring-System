from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import numpy as np
import cv2
import io
import base64
from typing import List, Optional
import os
from datetime import datetime, date

# Import our modules
from config.supabase_config import supabase, supabase_auth, TABLES, STORAGE_BUCKETS
from models.recognizer import FaceRecognizer
from models.detector import FaceDetector

app = FastAPI(title="Attendance Monitoring System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize face recognition models
face_detector = FaceDetector()
face_recognizer = FaceRecognizer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from Supabase"""
    try:
        token = credentials.credentials
        print(f"Received token: {token[:20]}..." if token else "No token received")
        
        # Verify token with Supabase using anon key client
        user = supabase_auth.auth.get_user(token)
        print(f"User verification result: {user.user.id if user and user.user else 'No user'}")
        
        if user and user.user:
            return user.user
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
async def root():
    return {"message": "Attendance Monitoring System API"}

@app.post("/api/register-face")
async def register_face(
    faculty_id: str = Form(...),
    image: UploadFile = File(...),
    user = Depends(verify_token)
):
    """Register a new face for a faculty member"""
    try:
        # Read and process image
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Detect face
        faces = face_detector.detect_faces(img)
        if not faces:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Get face embedding
        face_embedding = face_recognizer.get_embedding(img, faces[0])
        
        if face_embedding is None:
            raise HTTPException(status_code=400, detail="Failed to generate face embedding")
        
        # Upload image to Supabase Storage
        file_ext = image.filename.split('.')[-1]
        file_name = f"{faculty_id}/{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
        
        upload_result = supabase.storage.from_(STORAGE_BUCKETS['FACE_IMAGES']).upload(
            file_name, image_data, {"content-type": image.content_type}
        )
        
        if upload_result.error:
            raise HTTPException(status_code=500, detail="Failed to upload image")
        
        # Get public URL
        public_url = supabase.storage.from_(STORAGE_BUCKETS['FACE_IMAGES']).get_public_url(file_name)
        
        # Save face embedding to database as raw bytes (BYTEA format)
        embedding_result = supabase.table(TABLES['FACE_EMBEDDINGS']).insert({
            "faculty_id": faculty_id,
            "embedding_data": face_embedding.tobytes()
        }).execute()
        
        if embedding_result.error:
            raise HTTPException(status_code=500, detail="Failed to save embedding")
        
        # Save image record to database
        image_result = supabase.table(TABLES['FACE_IMAGES']).insert({
            "faculty_id": faculty_id,
            "image_path": file_name,
            "image_url": public_url
        }).execute()
        
        if image_result.error:
            raise HTTPException(status_code=500, detail="Failed to save image record")
        
        return {
            "success": True,
            "message": "Face registered successfully",
            "image_url": public_url,
            "embedding_id": embedding_result.data[0]['id'] if embedding_result.data else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class FaceCaptureRequest(BaseModel):
    faculty_name: str
    employee_id: str

@app.post("/api/start-face-capture")
async def start_face_capture(
    request: FaceCaptureRequest,
    # user = Depends(verify_token)  # Temporarily disabled for testing
):
    """Start face capture using OpenCV camera (no browser permissions needed)"""
    try:
        
        # Initialize camera
        cap = cv2.VideoCapture(0)  # Use default camera
        
        if not cap.isOpened():
            raise HTTPException(status_code=500, detail="Could not open camera")
        
        # Set camera properties
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        face_samples = []
        sample_count = 0
        max_samples = 50
        max_time = 60  # Maximum 60 seconds
        start_time = datetime.now()
        
        faculty_name = request.faculty_name
        employee_id = request.employee_id
        
        print(f"Starting automatic face capture for {faculty_name} ({employee_id})...")
        print("Camera will automatically capture 50 samples when faces are detected.")
        print(f"Maximum time: {max_time} seconds")
        print("Camera window should appear - position your face in the green rectangle")
        
        # Try to show camera window (with error handling)
        show_window = True
        try:
            cv2.namedWindow('Face Capture - Position your face in the green rectangle', cv2.WINDOW_NORMAL)
            cv2.resizeWindow('Face Capture - Position your face in the green rectangle', 640, 480)
        except Exception as e:
            print(f"Could not create camera window: {e}")
            show_window = False
        
        while sample_count < max_samples:
            # Check timeout
            if (datetime.now() - start_time).total_seconds() > max_time:
                print(f"Timeout reached after {max_time} seconds. Captured {sample_count} samples.")
                break
            ret, frame = cap.read()
            if not ret:
                break
            
            # Detect faces in frame
            faces = face_detector.detect_faces(frame)
            
            # Draw rectangle around detected face and show frame
            display_frame = frame.copy()
            for (x1, y1, x2, y2) in faces:
                cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(display_frame, f'Samples: {sample_count}/{max_samples}', 
                           (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            # Show frame if window creation was successful
            if show_window:
                try:
                    cv2.imshow('Face Capture - Position your face in the green rectangle', display_frame)
                    cv2.waitKey(1)  # Update window
                except Exception as e:
                    print(f"Could not display frame: {e}")
                    show_window = False
            
            if faces:
                # Capture face sample automatically
                face_crop = face_detector.crop_face(frame, faces[0])
                
                if face_crop is not None and face_crop.size > 0:
                    # Check if face crop is within reasonable size (100-800 pixels)
                    h, w = face_crop.shape[:2]
                    if 100 <= h <= 800 and 100 <= w <= 800:
                        # Resize face crop to standard size for better embedding generation
                        face_crop_resized = cv2.resize(face_crop, (224, 224))
                        
                        # Generate embedding using the resized crop
                        face_embedding = face_recognizer.get_embedding_from_crop(face_crop_resized)
                        
                        if face_embedding is not None:
                            # Save sample
                            face_samples.append({
                                'image': face_crop,
                                'embedding': face_embedding,
                                'timestamp': datetime.now().isoformat()
                            })
                            sample_count += 1
                            print(f"Captured sample {sample_count}/{max_samples}")
                            
                            # Small delay to avoid capturing too quickly
                            import time
                            time.sleep(0.2)  # Increased delay for better quality
                            
                            # Check if we have enough samples
                            if sample_count >= max_samples:
                                break
                        else:
                            print(f"Failed to generate embedding for sample {sample_count + 1} - face crop size: {face_crop.shape}")
                    else:
                        print(f"Face crop too small: {w}x{h} pixels")
            else:
                # No face detected, small delay
                import time
                time.sleep(0.05)
        
        # Release camera and close window
        cap.release()
        if show_window:
            try:
                cv2.destroyAllWindows()
            except Exception as e:
                print(f"Could not close camera window: {e}")
        
        if sample_count == 0:
            raise HTTPException(status_code=400, detail="No face samples captured")
        
        # Create faculty record if it doesn't exist
        faculty_result = supabase.table(TABLES['FACULTY']).select("*").eq('employee_id', employee_id).execute()
        
        if not faculty_result.data:
            # Create faculty record
            faculty_data = {
                "employee_id": employee_id,
                "department": "Computer Science",  # Default, can be updated later
                "designation": "Faculty",
                "is_active": True
            }
            faculty_result = supabase.table(TABLES['FACULTY']).insert(faculty_data).execute()
            
            if hasattr(faculty_result, 'error') and faculty_result.error:
                raise HTTPException(status_code=500, detail="Failed to create faculty record")
            
            faculty_id = faculty_result.data[0]['id']
        else:
            faculty_id = faculty_result.data[0]['id']
        
        # Save face samples to database and storage
        saved_samples = []
        print(f"Attempting to save {len(face_samples)} face samples to storage and database...")
        
        for i, sample in enumerate(face_samples):
            try:
                # Convert image to bytes
                _, img_encoded = cv2.imencode('.jpg', sample['image'])
                img_bytes = img_encoded.tobytes()
                
                # Upload to Supabase Storage
                file_name = f"{faculty_id}/sample_{i+1}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                
                upload_result = supabase.storage.from_(STORAGE_BUCKETS['FACE_IMAGES']).upload(
                    file_name, img_bytes, {"content-type": "image/jpeg"}
                )
                
                # Check if upload was successful (newer Supabase client structure)
                if hasattr(upload_result, 'error') and upload_result.error:
                    print(f"Upload error for sample {i+1}: {upload_result.error}")
                    continue
                elif hasattr(upload_result, 'data') and upload_result.data is None:
                    print(f"Upload failed for sample {i+1}: No data returned")
                    continue
                
                # Get public URL
                public_url = supabase.storage.from_(STORAGE_BUCKETS['FACE_IMAGES']).get_public_url(file_name)
                
                # Save image record
                image_result = supabase.table(TABLES['FACE_IMAGES']).insert({
                    "faculty_id": faculty_id,
                    "image_path": file_name,
                    "image_url": public_url
                }).execute()
                
                # Save embedding as raw bytes (BYTEA format)
                embedding_result = supabase.table(TABLES['FACE_EMBEDDINGS']).insert({
                    "faculty_id": faculty_id,
                    "embedding_data": sample['embedding'].tobytes()
                }).execute()
                
                # Check if database operations were successful
                image_success = not (hasattr(image_result, 'error') and image_result.error)
                embedding_success = not (hasattr(embedding_result, 'error') and embedding_result.error)
                
                if image_success and embedding_success:
                    saved_samples.append({
                        'image_url': public_url,
                        'embedding_id': embedding_result.data[0]['id'] if embedding_result.data else None
                    })
                else:
                    print(f"Database save failed for sample {i+1}: image_success={image_success}, embedding_success={embedding_success}")
                
            except Exception as e:
                print(f"Error saving sample {i+1}: {e}")
                continue
        
        print(f"Successfully saved {len(saved_samples)} out of {len(face_samples)} samples")
        
        if len(saved_samples) == 0:
            return {
                "success": False,
                "message": "Failed to save any face samples to storage/database",
                "samples_captured": 0,
                "faculty_id": faculty_id,
                "preview_image": None
            }
        else:
            return {
                "success": True,
                "message": f"Successfully captured {len(saved_samples)} face samples",
                "samples_captured": len(saved_samples),
                "faculty_id": faculty_id,
                "preview_image": saved_samples[0]['image_url'] if saved_samples else None
            }
        
    except Exception as e:
        # Make sure to release camera if there's an error
        try:
            cap.release()
            cv2.destroyAllWindows()
        except:
            pass
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-face-embedding")
async def generate_face_embedding(
    faculty_id: str = Form(...),
    image: UploadFile = File(...),
    user = Depends(verify_token)
):
    """Generate face embedding for a faculty member (called from frontend)"""
    try:
        # Read and process image
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Detect face
        faces = face_detector.detect_faces(img)
        if not faces:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Get face embedding
        face_embedding = face_recognizer.get_embedding(img, faces[0])
        
        if face_embedding is None:
            raise HTTPException(status_code=400, detail="Failed to generate face embedding")
        
        # Save face embedding to database as raw bytes (BYTEA format)
        embedding_result = supabase.table(TABLES['FACE_EMBEDDINGS']).insert({
            "faculty_id": faculty_id,
            "embedding_data": face_embedding.tobytes()
        }).execute()
        
        if hasattr(embedding_result, 'error') and embedding_result.error:
            raise HTTPException(status_code=500, detail="Failed to save embedding")
        
        return {
            "success": True,
            "message": "Face embedding generated successfully",
            "embedding_id": embedding_result.data[0]['id'] if embedding_result.data else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recognize-face")
async def recognize_face(
    image: UploadFile = File(...),
    user = Depends(verify_token)
):
    """Recognize a face and return faculty information"""
    try:
        # Read and process image
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Detect face
        faces = face_detector.detect_faces(img)
        if not faces:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Get face embedding
        face_embedding = face_recognizer.get_embedding(img, faces[0])
        
        # Get all face embeddings from database
        embeddings_result = supabase.table(TABLES['FACE_EMBEDDINGS']).select("*").execute()
        
        if hasattr(embeddings_result, 'error') and embeddings_result.error:
            raise HTTPException(status_code=500, detail="Failed to retrieve embeddings")
        
        # Find best match
        best_match = None
        best_score = 0
        threshold = 0.6
        
        for embedding_record in embeddings_result.data:
            # Read raw bytes directly (BYTEA format)
            stored_embedding = np.frombuffer(embedding_record['embedding_data'], dtype=np.float32)
            similarity = face_recognizer.cosine_similarity(face_embedding, stored_embedding)
            
            if similarity > best_score and similarity > threshold:
                best_score = similarity
                best_match = embedding_record
        
        if best_match:
            # Get faculty information
            faculty_result = supabase.table(TABLES['FACULTY']).select("*").eq("id", best_match['faculty_id']).execute()
            
            if faculty_result.data:
                faculty = faculty_result.data[0]
                return {
                    "success": True,
                    "faculty": faculty,
                    "confidence": float(best_score),
                    "recognized": True
                }
        
        return {
            "success": True,
            "recognized": False,
            "confidence": 0.0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/attendance/check-in")
async def check_in_attendance(
    faculty_id: str = Form(...),
    schedule_id: str = Form(...),
    image: UploadFile = File(...),
    user = Depends(verify_token)
):
    """Record attendance check-in with face recognition"""
    try:
        # First recognize the face
        recognition_result = await recognize_face(image, user)
        
        if not recognition_result.get("recognized", False):
            raise HTTPException(status_code=400, detail="Face not recognized")
        
        recognized_faculty_id = recognition_result["faculty"]["id"]
        
        # Verify the recognized face matches the claimed faculty
        if recognized_faculty_id != faculty_id:
            raise HTTPException(status_code=400, detail="Face does not match claimed faculty")
        
        # Check if attendance already exists for today
        today = date.today()
        existing_attendance = supabase.table(TABLES['ATTENDANCE']).select("*").eq(
            "faculty_id", faculty_id
        ).eq("schedule_id", schedule_id).eq("date", today.isoformat()).execute()
        
        if existing_attendance.data:
            raise HTTPException(status_code=400, detail="Attendance already recorded for today")
        
        # Record attendance
        attendance_result = supabase.table(TABLES['ATTENDANCE']).insert({
            "faculty_id": faculty_id,
            "schedule_id": schedule_id,
            "date": today.isoformat(),
            "status": "present",
            "check_in_time": datetime.now().isoformat(),
            "recognition_confidence": recognition_result["confidence"],
            "method": "face_recognition"
        }).execute()
        
        if attendance_result.error:
            raise HTTPException(status_code=500, detail="Failed to record attendance")
        
        return {
            "success": True,
            "message": "Attendance recorded successfully",
            "confidence": recognition_result["confidence"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/attendance/{faculty_id}")
async def get_attendance(
    faculty_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user = Depends(verify_token)
):
    """Get attendance records for a faculty member"""
    try:
        query = supabase.table(TABLES['ATTENDANCE']).select("*").eq("faculty_id", faculty_id)
        
        if start_date:
            query = query.gte("date", start_date)
        if end_date:
            query = query.lte("date", end_date)
        
        result = query.order("date", desc=True).execute()
        
        if result.error:
            raise HTTPException(status_code=500, detail="Failed to retrieve attendance")
        
        return {
            "success": True,
            "data": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/faculty")
async def get_faculty(user = Depends(verify_token)):
    """Get all faculty members"""
    try:
        result = supabase.table(TABLES['FACULTY']).select("*").eq("is_active", True).execute()
        
        if result.error:
            raise HTTPException(status_code=500, detail="Failed to retrieve faculty")
        
        return {
            "success": True,
            "data": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 