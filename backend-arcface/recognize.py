import os
import cv2
import numpy as np
from insightface.app import FaceAnalysis

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def load_database(emb_dir):
    database = {}
    for file in os.listdir(emb_dir):
        if file.endswith('.npy'):
            name = file.split('_')[0]
            emb = np.load(os.path.join(emb_dir, file))
            if name not in database:
                database[name] = []
            database[name].append(emb)
    return database

if __name__ == "__main__":
    app = FaceAnalysis(providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0)
    database = load_database("embeddings")

    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        faces = app.get(frame)
        for face in faces:
            x, y, w, h = face['bbox'].astype(int)
            embedding = face['embedding']
            name = "Unknown"
            best_score = -1
            for person, embs in database.items():
                for emb in embs:
                    score = cosine_similarity(embedding, emb)
                    if score > best_score:
                        best_score = score
                        name = person if score > 0.6 else "Unknown"
            cv2.rectangle(frame, (x, y), (w, h), (0, 255, 0), 2)
            cv2.putText(frame, f"{name} ({best_score:.2f})", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.imshow("Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows() 