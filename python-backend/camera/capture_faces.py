import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import cv2
import time
from models.detector import detect_faces
from models.recognizer import get_embedding
import numpy as np
import json


def register_faculty(faculty_id, save_dir="data/faculty"):
    cap = cv2.VideoCapture(0)
    count = 0
    max_images = 25  # Limit to 25 frames
    os.makedirs(f"{save_dir}/{faculty_id}/images", exist_ok=True)
    embeddings = []
    start_time = time.time()
    max_duration = 20  # seconds

    while count < max_images and (time.time() - start_time) < max_duration:
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow('Register Face - Press Q to Quit', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        faces = detect_faces(frame)
        for (x1, y1, x2, y2) in faces:
            face_img = frame[y1:y2, x1:x2]
            embedding = get_embedding(face_img)

            if embedding is not None:
                count += 1
                img_path = f"{save_dir}/{faculty_id}/images/img_{count:03d}.jpg"
                cv2.imwrite(img_path, face_img)

                embeddings.append(embedding.tolist())

                print(f"[{count}/{max_images}] Saved.")

            if count >= max_images:
                break

        # Optional: slow down capture if needed
        time.sleep(0.3)

    cap.release()
    cv2.destroyAllWindows()
    # Save embeddings as JSON
    emb_path = f"{save_dir}/{faculty_id}/embeddings.json"
    with open(emb_path, "w") as f:
        json.dump(embeddings, f)
    print(f"Embeddings saved to {emb_path}")
    return embeddings


if __name__ == "__main__":
    faculty_id = input("Enter faculty ID for registration: ")
    register_faculty(faculty_id)
