import React from 'react';
import axios from 'axios';

function GradioUI({ onRecordingStop, isRecording }) {
  const handleRecordingStop = async (blob) => {
    onRecordingStop(blob);

    try {
      const formData = new FormData();
      formData.append('audio', blob);

      // Replace 'http://localhost:5000/transcribe_audio' with your backend endpoint
      const response = await axios.post('http://localhost:7860/transcribe_audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the transcribed text in your React state or perform any other action
      console.log('Transcribed text:', response.data.transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div>
      <h2>Voice Recognition</h2>
      <button onClick={handleRecordingStop} disabled={!isRecording}>Stop Recording</button>
    </div>
  );
}

export default GradioUI;
