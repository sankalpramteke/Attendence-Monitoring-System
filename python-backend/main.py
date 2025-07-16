from fastapi import FastAPI
from camera.capture_faces import register_faculty

app = FastAPI()

@app.post("/register/{faculty_id}")
def register(faculty_id: str):
    embeddings = register_faculty(faculty_id)
    return {"message": f"Captured {len(embeddings)} samples", "status": "success"}
