import os
import cv2
import numpy as np
from insightface.app import FaceAnalysis

SAMPLES_PER_PERSON = 50

def collect_and_embed(person_name, save_dir, emb_dir):
    os.makedirs(save_dir, exist_ok=True)
    os.makedirs(emb_dir, exist_ok=True)
    app = FaceAnalysis(providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0)

    cap = cv2.VideoCapture(0)
    count = 0
    while count < SAMPLES_PER_PERSON:
        ret, frame = cap.read()
        if not ret:
            break
        faces = app.get(frame)
        if faces:
            face = faces[0]
            h, w, _ = frame.shape
            x1, y1, x2, y2 = face['bbox'].astype(int)
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)
            face_crop = frame[y1:y2, x1:x2]
            embedding = face['embedding']
            # Only save if the crop is valid and non-empty
            if face_crop.size > 0 and (y2 - y1) > 0 and (x2 - x1) > 0:
                img_path = os.path.join(save_dir, f"{count+1}.jpg")
                emb_path = os.path.join(emb_dir, f"{person_name}_{count+1:03d}.npy")
                cv2.imwrite(img_path, face_crop)
                np.save(emb_path, embedding)
                count += 1
                cv2.putText(frame, f"Samples: {count}/{SAMPLES_PER_PERSON}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.imshow("Register - Press 'q' to quit", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    person_name = input("Enter person's name: ").strip()
    collect_and_embed(person_name, "images/" + person_name, "embeddings") 