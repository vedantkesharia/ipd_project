// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [response, setResponse] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [inputCommand, setInputCommand] = useState('');

//   useEffect(() => {
//     if (response.toLowerCase().includes('search')) {
//       handleGetSummary();
//     }
//   }, [response]);

//   const handleRecord = () => {
//     if (inputCommand.toLowerCase().includes('search')) {
//       handleGetSummary();
//     } else {
//       setIsRecording(true);
//       startRecording();
//     }
//   };

//   const startRecording = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then((stream) => {
//         const mediaRecorder = new MediaRecorder(stream);
//         const audioChunks = [];

//         mediaRecorder.ondataavailable = (event) => {
//           audioChunks.push(event.data);
//         };

//         mediaRecorder.onstop = async () => {
//           const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//           setAudioBlob(audioBlob);
//           setIsRecording(false);

//           try {
//             const formData = new FormData();
//             formData.append('audio', audioBlob, 'recorded.wav');

//             const response = await axios.post('http://localhost:8000/process_voice', formData, {
//               headers: {
//                 'Content-Type': 'multipart/form-data',
//               },
//             });

//             setResponse(response.data.response);
//           } catch (error) {
//             console.error('Error processing audio:', error);
//           }
//         };

//         mediaRecorder.start();

//         // Stop recording after 5 seconds
//         setTimeout(() => {
//           mediaRecorder.stop();
//         }, 5000);
//       })
//       .catch((error) => {
//         console.error('Error accessing microphone:', error);
//       });
//   };

//   const handleInputChange = (event) => {
//     setInputCommand(event.target.value);
//   };

//   const handleGetSummary = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('text', response);

//       const summaryResponse = await axios.post('http://localhost:5000/generate_summary', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setResponse(summaryResponse.data.summary);
//       narrate(summaryResponse.data.summary);
//     } catch (error) {
//       console.error('Error generating summary:', error);
//     }
//   };

//   const narrate = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={inputCommand}
//         onChange={handleInputChange}
//         placeholder="Enter command..."
//       />
//       <button onClick={handleRecord} disabled={isRecording}>
//         {inputCommand.toLowerCase().includes('search') ? 'Get Summary' : 'Start Recording'}
//       </button>
//       {isRecording && <p>Recording...</p>}
//       {response && (
//         <div>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;








import React, { useState } from 'react';
import axios from 'axios';
import SpeechRecognition,{ useSpeechRecognition } from 'react-speech-recognition';
import GradioUI from './GradioUI';

function App() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const commands = [
    {
      command: 'clear',
      callback: () => setTitle(''),
    },
  ];

  // const {
  //   transcript,
  //   listening,
  //   startListening,
  //   stopListening,
  //   resetTranscript,
  // } = useSpeechRecognition({ commands });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleRecord = () => {
    setIsRecording(true);
    SpeechRecognition.startListening();
  };

  const handleStopRecording = (blob) => {
    console.log('Audio Blob:', blob);
    setIsRecording(false);
    setAudioBlob(blob);
    SpeechRecognition.stopListening();
    setTitle(transcript); // Set recognized text to the title
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (audioBlob) {
        formData.append('audio', audioBlob);
      }

      console.log('Form Data:', formData);

      const response = await axios.post('http://localhost:5000/get_summary', { title }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  return (
    <div>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleRecord} disabled={isRecording || listening}>
        Record
      </button>
      {isRecording && <p>Recording...</p>}
      <button onClick={handleSubmit} disabled={isRecording || listening}>
        Get Summary
      </button>
      {summary && <p>{summary}</p>}

      <GradioUI
        onRecordingStop={handleStopRecording}
        isRecording={isRecording}
      />
    </div>
  );
}

export default App;





// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const handleRecord = () => {
//     setIsRecording(true);
//     setTitle('');
//   };

//   const handleStopRecording = async (blob) => {
//     setIsRecording(false);
//     setAudioBlob(blob);

//     try {
//       const formData = new FormData();
//       formData.append('audio', blob); // Set a filename for the audio

//       const response = await axios.post('http://localhost:8000/whisper', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Set the content type explicitly
//         },
//       });

//       setTitle(response.data.result);
//     } catch (error) {
//       console.error('Error transcribing:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', title);
//       if (audioBlob) {
//         formData.append('audio', audioBlob, 'audio.wav'); // Set a filename for the audio
//       }

//       const response = await axios.post('http://localhost:5000/get_summary', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       setSummary(response.data.summary);
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <button onClick={handleRecord} disabled={isRecording}>
//         Start Recording
//       </button>
//       <button onClick={() => handleStopRecording(audioBlob)} disabled={!isRecording}>
//         Stop Recording
//       </button>
//       <button onClick={handleSubmit} disabled={isRecording}>
//         Get Summary
//       </button>
//       {summary && (
//         <div>
//           <h2>Summary</h2>
//           <p>{summary}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;













// import React, { useState } from 'react';
// import axios from 'axios';
// import GradioUI from './GradioUI'; // Import your Gradio component
// import SpeechRecognition from 'react-speech-recognition';

// function App() {
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const handleRecord = () => {
//     setIsRecording(true);
//   };

//   const handleStopRecording = (blob) => {
//     console.log('Audio Blob:', blob);
//     setIsRecording(false);
//     setAudioBlob(blob);
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', title); 
//       formData.append('audio', audioBlob);
//       if (audioBlob) {  // Added this condition
//         formData.append('audio', audioBlob);
//       }
  
//       console.log('Form Data:', formData);
//       // Send the data as JSON
//       const response = await axios.post('http://localhost:5000/get_summary', { title }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       setSummary(response.data.summary);
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <button onClick={handleRecord} disabled={isRecording}>Record</button>
//       {isRecording && <p>Recording...</p>}
//       <button onClick={handleSubmit} disabled={isRecording}>Get Summary</button>
//       {summary && <p>{summary}</p>}

//       {/* Add the Gradio voice recognition UI */}
//       <GradioUI
//         onRecordingStop={handleStopRecording}
//         isRecording={isRecording}
//       />
//     </div>
//   );
// }

// export default App;






// import React, { useState } from 'react';
// import axios from 'axios';
// import GradioUI from './GradioUI'; // Import your Gradio component

// function App() {
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const handleRecord = () => {
//     setIsRecording(true);
//   };

//   const handleStopRecording = (blob) => {
//     setIsRecording(false);
//     setAudioBlob(blob);
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('audio', audioBlob);

//       const response = await axios.post('http://localhost:5000/get_summary', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSummary(response.data.summary);
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <button onClick={handleRecord} disabled={isRecording}>Record</button>
//       {isRecording && <p>Recording...</p>}
//       <button onClick={handleSubmit} disabled={isRecording}>Get Summary</button>
//       {summary && <p>{summary}</p>}

//       {/* Add the Gradio voice recognition UI */}
//       <GradioUI
//         onRecordingStop={handleStopRecording}
//         isRecording={isRecording}
//       />
//     </div>
//   );
// }

// export default App;




// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/get_summary', { title });
//       setSummary(response.data.summary);
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <button onClick={handleSubmit}>Get Summary</button>
//       {summary && <p>{summary}</p>}
//     </div>
//   );
// }

// export default App;












// import React, { useState, useEffect } from 'react';
// // import './App.css';

// function App() {
//   const [summary, setSummary] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:5000/get_summary')  
//       .then(response => response.json())
//       .then(data =>{
//         console.log(data);
//         setSummary(data.summary)
//       })
//       .catch(error => console.error('Error fetching summary:', error));
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Taj Mahal Summary</h1>
//         <p>{summary}</p>
//       </header>
//     </div>
//   );
// }

// export default App;

