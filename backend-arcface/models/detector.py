import cv2
import numpy as np
from ultralytics import YOLO
import os

class FaceDetector:
    def __init__(self, model_path=None):
        """Initialize face detector with YOLOv8 model"""
        try:
            if model_path is None:
                # Use standard YOLOv8 model that will be downloaded automatically
                self.model = YOLO('yolov8n.pt')
                self.use_yolo = True
            else:
                self.model = YOLO(model_path)
                self.use_yolo = True
        except Exception as e:
            print(f"YOLO model loading failed: {e}")
            print("Falling back to OpenCV face detection...")
            # Fallback to OpenCV face detection
            self.model = None
            self.use_yolo = False
            # Load OpenCV face cascade
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
    
    def detect_faces(self, image):
        """
        Detect faces in the image
        
        Args:
            image: OpenCV image (numpy array)
            
        Returns:
            List of face bounding boxes [x1, y1, x2, y2]
        """
        try:
            if self.use_yolo:
                # Run YOLOv8 inference
                results = self.model(image, verbose=False)
                
                faces = []
                for result in results:
                    boxes = result.boxes
                    if boxes is not None:
                        for box in boxes:
                            # Get bounding box coordinates
                            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                            faces.append([int(x1), int(y1), int(x2), int(y2)])
                
                return faces
            else:
                # Use OpenCV face detection
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                face_rects = self.face_cascade.detectMultiScale(
                    gray, 
                    scaleFactor=1.1, 
                    minNeighbors=5, 
                    minSize=(30, 30)
                )
                
                faces = []
                for (x, y, w, h) in face_rects:
                    faces.append([x, y, x + w, y + h])
                
                return faces
            
        except Exception as e:
            print(f"Error in face detection: {e}")
            return []
    
    def crop_face(self, image, bbox):
        """
        Crop face from image using bounding box
        
        Args:
            image: OpenCV image
            bbox: Bounding box [x1, y1, x2, y2]
            
        Returns:
            Cropped face image
        """
        x1, y1, x2, y2 = bbox
        h, w = image.shape[:2]
        
        # Ensure coordinates are within image bounds
        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(w, x2)
        y2 = min(h, y2)
        
        # Crop face
        face_crop = image[y1:y2, x1:x2]
        
        return face_crop
    
    def draw_faces(self, image, faces):
        """
        Draw bounding boxes around detected faces
        
        Args:
            image: OpenCV image
            faces: List of face bounding boxes
            
        Returns:
            Image with drawn bounding boxes
        """
        result_image = image.copy()
        
        for bbox in faces:
            x1, y1, x2, y2 = bbox
            cv2.rectangle(result_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        return result_image 