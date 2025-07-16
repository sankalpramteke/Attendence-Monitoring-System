from ultralytics import YOLO
import cv2

# Load YOLOv8 model (pretrained for face detection)
model = YOLO("yolov8n.pt")  # Replace with custom face model if needed

def detect_faces(frame):
    results = model(frame)
    boxes = []
    for r in results:
        for box in r.boxes.xyxy.cpu().numpy():
            x1, y1, x2, y2 = map(int, box)
            boxes.append((x1, y1, x2, y2))
    return boxes
