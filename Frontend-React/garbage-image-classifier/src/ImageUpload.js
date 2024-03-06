import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCapture = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please capture an image first!');
      return;
    }

    setIsLoading(true);
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
      setError('Error in prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" capture="environment" accept="image/*" onChange={handleCapture} />
        <button type="submit">Predict Waste Type</button>
      </form>
      {isLoading && <div>Loading...</div>}
      {prediction && <div>Prediction: {prediction}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default ImageUpload;
