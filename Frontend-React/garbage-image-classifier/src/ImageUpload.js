import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');

  const handleCapture = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please capture an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" capture="environment" accept="image/*" onChange={handleCapture} />
        <button type="submit">Predict Waste Type</button>
      </form>
      {prediction && <div>Prediction: {prediction}</div>}
    </div>
  );
};

export default ImageUpload;
