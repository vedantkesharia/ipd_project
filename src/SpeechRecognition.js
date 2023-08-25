const SpeechRecognitionComponent = ({ transcript, startListening, stopListening, listening }) => {
    return (
      <div>
        <button onClick={listening ? stopListening : startListening} disabled={false}>
          {listening ? 'Stop' : 'Start'} Recording
        </button>
        {listening && <p>Recording...</p>}
      </div>
    );
  };
  
  const options = {
    autoStart: false, // Do not start listening automatically when component mounts
  };
  
  const WrappedSpeechRecognition = SpeechRecognition(options)(SpeechRecognitionComponent);
  