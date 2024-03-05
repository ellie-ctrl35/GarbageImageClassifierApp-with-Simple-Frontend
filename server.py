from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from io import BytesIO
from PIL import Image
import numpy as np

app = FastAPI()

# CORS middleware configuration
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = load_model('/Users/mac/Documents/ModelTraining-Backend-FASTAPI/model')

# Class names
class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

def read_image(file) -> np.ndarray:
    image = Image.open(BytesIO(file))
    image = image.resize((384, 384))
    return np.array(image)

def predict(image: np.ndarray):
    image_batch = np.expand_dims(image, axis=0)
    predictions = model.predict(image_batch)
    return predictions

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    image = await file.read()
    image = read_image(image)
    predictions = predict(image)
    predicted_index = np.argmax(predictions)
    predicted_class = class_names[predicted_index]
    return {"prediction": predicted_class}
