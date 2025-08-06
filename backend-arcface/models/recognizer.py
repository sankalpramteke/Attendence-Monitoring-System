import cv2
import numpy as np
from insightface.app import FaceAnalysis
import os

class FaceRecognizer:
    def __init__(self, model_name='buffalo_l'):
        """Initialize face recognizer with InsightFace"""
        self.app = FaceAnalysis(providers=['CPUExecutionProvider'])
        self.app.prepare(ctx_id=0, det_size=(640, 640))
    
    def get_embedding(self, image, bbox):
        """
        Get face embedding from image using bounding box
        
        Args:
            image: OpenCV image
            bbox: Bounding box [x1, y1, x2, y2]
            
        Returns:
            Face embedding vector
        """
        try:
            # Crop face from image
            x1, y1, x2, y2 = bbox
            h, w = image.shape[:2]
            
            # Ensure coordinates are within image bounds
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)
            
            face_crop = image[y1:y2, x1:x2]
            
            if face_crop.size == 0:
                raise ValueError("Empty face crop")
            
            # Get face embedding using InsightFace
            faces = self.app.get(face_crop)
            
            if not faces:
                raise ValueError("No face detected in crop")
            
            # Return the embedding of the first detected face
            return faces[0]['embedding']
            
        except Exception as e:
            print(f"Error getting face embedding: {e}")
            return None
    
    def get_embedding_from_crop(self, face_crop):
        """
        Get face embedding directly from a face crop image
        
        Args:
            face_crop: OpenCV image (cropped face)
            
        Returns:
            Face embedding vector
        """
        try:
            if face_crop.size == 0:
                raise ValueError("Empty face crop")
            
            # Get face embedding using InsightFace
            faces = self.app.get(face_crop)
            
            if not faces:
                raise ValueError("No face detected in crop")
            
            # Return the embedding of the first detected face
            return faces[0]['embedding']
            
        except Exception as e:
            print(f"Error getting face embedding from crop: {e}")
            return None
    
    def cosine_similarity(self, embedding1, embedding2):
        """
        Calculate cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Cosine similarity score (0-1)
        """
        try:
            # Normalize embeddings
            norm1 = np.linalg.norm(embedding1)
            norm2 = np.linalg.norm(embedding2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            # Calculate cosine similarity
            similarity = np.dot(embedding1, embedding2) / (norm1 * norm2)
            return float(similarity)
            
        except Exception as e:
            print(f"Error calculating cosine similarity: {e}")
            return 0.0
    
    def recognize_face(self, image, stored_embeddings, threshold=0.6):
        """
        Recognize a face by comparing with stored embeddings
        
        Args:
            image: OpenCV image
            stored_embeddings: List of (id, embedding) tuples
            threshold: Similarity threshold for recognition
            
        Returns:
            Tuple of (recognized_id, confidence_score) or (None, 0.0)
        """
        try:
            # Detect faces in image
            faces = self.app.get(image)
            
            if not faces:
                return None, 0.0
            
            # Get embedding of the first detected face
            current_embedding = faces[0]['embedding']
            
            # Compare with stored embeddings
            best_match = None
            best_score = 0.0
            
            for stored_id, stored_embedding in stored_embeddings:
                similarity = self.cosine_similarity(current_embedding, stored_embedding)
                
                if similarity > best_score and similarity > threshold:
                    best_score = similarity
                    best_match = stored_id
            
            return best_match, best_score
            
        except Exception as e:
            print(f"Error in face recognition: {e}")
            return None, 0.0
    
    def get_face_landmarks(self, image, bbox):
        """
        Get face landmarks from image
        
        Args:
            image: OpenCV image
            bbox: Bounding box [x1, y1, x2, y2]
            
        Returns:
            Face landmarks (keypoints)
        """
        try:
            # Crop face from image
            x1, y1, x2, y2 = bbox
            h, w = image.shape[:2]
            
            # Ensure coordinates are within image bounds
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)
            
            face_crop = image[y1:y2, x1:x2]
            
            if face_crop.size == 0:
                return None
            
            # Get face landmarks using InsightFace
            faces = self.app.get(face_crop)
            
            if not faces:
                return None
            
            # Return landmarks of the first detected face
            return faces[0]['kps']
            
        except Exception as e:
            print(f"Error getting face landmarks: {e}")
            return None 