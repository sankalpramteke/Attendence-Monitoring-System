import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import cv2
import numpy as np
import json
import time
from models.detector import detect_faces
from models.recognizer import get_embedding

def load_all_embeddings(data_dir="data/faculty"):
    db = {}
    for faculty_id in os.listdir(data_dir):
        emb_path = os.path.join(data_dir, faculty_id, "embeddings.json")
        if os.path.exists(emb_path):
            with open(emb_path, "r") as f:
                db[faculty_id] = np.array(json.load(f))
    return db

def recognize_face(frame, db, threshold=1.2):
    faces = detect_faces(frame)
    results = []
    for (x1, y1, x2, y2) in faces:
        face_img = frame[y1:y2, x1:x2]
        emb = get_embedding(face_img)
        if emb is not None:
            emb = np.array(emb)
            best_id = None
            best_score = float("inf")
            for faculty_id, embeddings in db.items():
                dists = np.linalg.norm(embeddings - emb, axis=1)
                min_dist = np.min(dists)
                if min_dist < best_score:
                    best_score = min_dist
                    best_id = faculty_id
            print(f"Best match: {best_id} with score {best_score}")
            if best_score < threshold:
                results.append((x1, y1, x2, y2, best_id, best_score))
            else:
                results.append((x1, y1, x2, y2, "Unknown", best_score))
    return results

if __name__ == "__main__":
    db = load_all_embeddings()
    cap = cv2.VideoCapture(0)
    print("Press Q to quit or wait 10 seconds.")
    start_time = time.time()
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        results = recognize_face(frame, db)
        for (x1, y1, x2, y2, name, score) in results:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
            cv2.putText(frame, f"{name} ({score:.2f})", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
        cv2.imshow("Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        if (time.time() - start_time) > 10:
            print("Recognition window closed after 10 seconds.")
            break
    cap.release()
    cv2.destroyAllWindows() 