from insightface.app import FaceAnalysis
import cv2

app = FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))

def get_embedding(face_image):
    faces = app.get(face_image)
    if faces:
        return faces[0].embedding
    return None
