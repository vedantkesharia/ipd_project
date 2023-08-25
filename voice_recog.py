import whisper
import gradio as gr
from flask import Flask, request, jsonify

app = Flask(__name__)
from flask_cors import CORS  

CORS(app)  
def transcribe_audio(audio):
    # Load the Whisper ASR model
    model = whisper.load_model("small")

    audio = whisper.load_audio(audio)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    _, probs = model.detect_language(mel)
    detected_language = max(probs, key=probs.get)

    options = whisper.DecodingOptions(fp16=False)
    result = whisper.decode(model, mel, options)
    return result.text, detected_language

if __name__ == '__main__':
    gr.Interface(
        title='OpenAI Whisper ASR Gradio Web UI',
        fn=transcribe_audio,
        inputs=[
            gr.inputs.Audio(source="microphone", type="filepath")
        ],
        outputs=[
            "textbox", "text"
        ],
        live=True).launch()
