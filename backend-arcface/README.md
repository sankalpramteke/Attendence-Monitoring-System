# ArcFace + RetinaFace Face Recognition Backend

This backend uses [InsightFace](https://github.com/deepinsight/insightface) (RetinaFace for detection, ArcFace for embedding) for high-accuracy, real-time face recognition. It is fully compatible with Python 3.12 and supports registering and recognizing multiple people.

## Project Structure

```
backend-arcface/
│
├── register.py            # Register faces, save cropped face images and ArcFace embeddings
├── recognize.py           # Real-time recognition using webcam
├── images/                # Stores cropped face images per person
│   ├── sankalp/
│   ├── talman/
│   └── ...
├── embeddings/            # Saved ArcFace embeddings (.npy files)
│   ├── sankalp_001.npy
│   ├── talman_001.npy
│   └── ...
├── requirements.txt       # Python dependencies
├── README.md              # This file
```

## Requirements
- Python 3.8–3.12
- Webcam

## Installation

1. **Create and activate a virtual environment (recommended):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. **Install dependencies:**
   ```powershell
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## requirements.txt
```
insightface
onnxruntime
opencv-python
numpy
```

## Usage

### 1. Register a Person
Run:
```powershell
python register.py
```
- Enter the person's name when prompted.
- The script will open the webcam and collect 50 face samples (cropped and embedded) for that person.
- Press 'q' to quit early.
- Images are saved in `images/<person_name>/`, embeddings in `embeddings/`.

### 2. Recognize Faces in Real Time
Run:
```powershell
python recognize.py
```
- The webcam will open and recognize any registered person in real time.
- The system supports 3, 5, or more people—just register each one with `register.py`.

## How It Works
- **Detection & Alignment:** Uses RetinaFace (via InsightFace) to detect and crop faces from the webcam feed.
- **Embedding:** Uses ArcFace (via InsightFace) to generate a 512-d embedding for each face.
- **Recognition:** Compares live embeddings to all saved embeddings using cosine similarity.

## Tips for Best Accuracy
- Collect 50+ clear, varied samples per person (different angles, lighting, expressions).
- Make sure faces are not blurry or occluded.
- Use unique names for each person.
- The system is fast and accurate for 3–7 people. For larger groups, consider optimizing the embedding search.

## Troubleshooting
- If you see errors about model loading, make sure you are using the default model (no `name='antelopev2'` in the code).
- If you get OpenCV errors about empty images, ensure your face is fully in the frame.
- If you upgrade insightface, re-test registration and recognition.

## References
- [InsightFace](https://github.com/deepinsight/insightface)
- [ArcFace Paper](https://arxiv.org/abs/1801.07698)
- [RetinaFace Paper](https://arxiv.org/abs/1905.00641) 