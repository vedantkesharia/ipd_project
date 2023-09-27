from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai
import speech_recognition as sr
import pyttsx3
import json
import threading

app = Flask(__name__)
CORS(app)

openai.api_key = 'sk-6Or4GI6jyUeTYuzpM6TUT3BlbkFJ3y2Pegu3vFG9P6200Hu'  # Replace with your OpenAI API key

usewhisper = True

# pyttsx3 setup
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)  # 0 for male, 1 for female

# speech recognition set-up
r = sr.Recognizer()
mic = sr.Microphone(device_index=0)
r.dynamic_energy_threshold = False
r.energy_threshold = 400

messages = [{"role": "system", "content": ""}]  # Initialize with empty system message

def whisper(audio):
    with open('speech.wav', 'wb') as f:
        f.write(audio.get_wav_data())
    speech = open('speech.wav', 'rb')
    wcompletion = openai.Audio.transcribe(
        model="whisper-1",
        file=speech
    )
    user_input = wcompletion['text']
    print(user_input)
    return user_input

def save_inprogress(suffix, save_foldername):
    os.makedirs(save_foldername, exist_ok=True)
    base_filename = 'conversation'
    filename = os.path.join(save_foldername, f'{base_filename}_{suffix}.txt')

    with open(filename, 'w') as file:
        json.dump(messages, file, indent=4)

@app.route('/process_voice', methods=['POST'])
def process_voice():
    try:
        data = request.files['audio']
        audio_path = 'temp_audio.wav'
        data.save(audio_path)

        with sr.AudioFile(audio_path) as source:
            audio = r.record(source)
            try:
                if usewhisper:
                    user_input = whisper(audio)
                else:
                    user_input = r.recognize_google(audio)
            except:
                return jsonify({"response": "Error processing audio"})

        messages.append({"role": "user", "content": user_input})

        completion = openai.Completion.create(
            engine="davinci",
            prompt=user_input,
            max_tokens=100
        )

        response = completion.choices[0].text.strip()
        messages.append({"role": "assistant", "content": response})

        response_data = {
            "response": response,
            "transcribedCommand": user_input,
        }

        threading.Thread(target=save_inprogress, args=(suffix, save_foldername)).start()
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"response": "Error processing voice command", "error": str(e)})

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    foldername = "voice_assistant"
    save_foldername = os.path.join(script_dir, f"conversations/{foldername}")
    suffix = len(os.listdir(save_foldername))
    
    app.run(debug=True, port=8000)












# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_cors import cross_origin
# import os
# import openai
# import speech_recognition as sr
# import pyttsx3
# import json
# import threading

# app = Flask(__name__)
# CORS(app)

# openai.api_key = 'sk-6Or4GI6jyUeTYuzpM6TUT3BlbkFJ3y2Pegu3vFG9P6200Hu'  # Replace with your OpenAI API key

# personality = "p.txt"
# usewhisper = True

# # pyttsx3 setup
# engine = pyttsx3.init()
# voices = engine.getProperty('voices')
# engine.setProperty('voice', voices[1].id)  # 0 for male, 1 for female

# # speech recognition set-up
# r = sr.Recognizer()
# mic = sr.Microphone(device_index=0)
# r.dynamic_energy_threshold = False
# r.energy_threshold = 400

# messages = [{"role": "system", "content": ""}]  # Initialize with empty system message

# def whisper(audio):
#     with open('speech.wav', 'wb') as f:
#         f.write(audio.get_wav_data())
#     speech = open('speech.wav', 'rb')
#     wcompletion = openai.Audio.transcribe(
#         model="whisper-1",
#         file=speech
#     )
#     user_input = wcompletion['text']
#     print(user_input)
#     return user_input


# def save_inprogress(suffix, save_foldername):
#     '''
#     Uses the suffix number returned from save_conversation to continually update the 
#     file for this instance of execution.  This is so that you can save the conversation 
#     as you go so if it crashes, you don't lose the conversation. Shouldn't be called
#     from outside of the class.

#     Args:
#         suffix  :  Takes suffix count from save_conversation()
#     '''
#     os.makedirs(save_foldername, exist_ok=True)
#     base_filename = 'conversation'
#     filename = os.path.join(save_foldername, f'{base_filename}_{suffix}.txt')

#     with open(filename, 'w') as file:
#         json.dump(messages, file, indent=4)


# @app.route('/process_voice', methods=['POST'])
# @cross_origin(origins='*', methods=['POST'], headers=['Content-Type'])
# def process_voice():
#     data = request.files['audio']
#     audio_path = 'temp_audio.wav'
#     data.save(audio_path)


#     with sr.AudioFile(audio_path) as source:
#         audio = r.record(source)
#         try:
#             if usewhisper:
#                 user_input = whisper(audio)
#             else:
#                 user_input = r.recognize_google(audio)
#         except:
#             return jsonify({"response": "Error processing audio"})

#     messages.append({"role": "user", "content": user_input})

#     completion = openai.Completion.create(
#         engine="davinci",
#         prompt=user_input,
#         max_tokens=100
#     )

#     response = completion.choices[0].text.strip()
#     messages.append({"role": "assistant", "content": response})
#     # save_inprogress(suffix, save_foldername)

#     # engine.say(response)
#     # engine.runAndWait()

#     threading.Thread(target=save_inprogress, args=(suffix, save_foldername)).start()
#     return jsonify({"response": response})


# if __name__ == '__main__':
#     script_dir = os.path.dirname(os.path.abspath(__file__))
#     foldername = "voice_assistant"
#     save_foldername = os.path.join(script_dir, f"conversations/{foldername}")
#     suffix = len(os.listdir(save_foldername))
    
#     app.run(debug=True,port=8000)







# from flask import Flask, request, jsonify
# from langchain.llms import HuggingFacePipeline
# from transformers import AutoTokenizer, WhisperProcessor, pipeline
# from flask_cors import CORS 
# app = Flask(__name__)
# CORS(app, resources={r"/whisper": {"origins": "http://localhost:3000"}})

# model_id = 'openai/whisper-large-v2'
# # tokenizer = AutoTokenizer.from_pretrained(model_id)
# # model = WhisperProcessor.from_pretrained(model_id)
# pipe = pipeline("automatic-speech-recognition", model='openai/whisper-large-v2')
# local_llm = HuggingFacePipeline(pipeline=pipe)

# @app.route('/whisper', methods=['POST'])
# def whisper():
#     text = request.json['text']
#     result = local_llm(text)
#     return jsonify({'result': result})
#     # audio = request.files['audio']
#     # result = local_llm(audio.read())
#     # return jsonify({'result': result[0]['transcription']})

# if __name__ == '__main__':
#     app.run(debug=True,port=8000)





# import whisper
# import gradio as gr
# from flask import Flask, request, jsonify

# app = Flask(__name__)
# from flask_cors import CORS  

# CORS(app)

# @app.route('/transcribe_audio', methods=['POST'])
# def transcribe_audio(audio):
#     # Load the Whisper ASR model
#     model = whisper.load_model("small")

#     audio = whisper.load_audio(audio)
#     audio = whisper.pad_or_trim(audio)
#     mel = whisper.log_mel_spectrogram(audio).to(model.device)

#     _, probs = model.detect_language(mel)
#     detected_language = max(probs, key=probs.get)

#     options = whisper.DecodingOptions(fp16=False)
#     result = whisper.decode(model, mel, options)
#     return result.text, detected_language

# if __name__ == '__main__':
#     gr.Interface(
#         title='OpenAI Whisper ASR Gradio Web UI',
#         fn=transcribe_audio,
#         inputs=[
#             gr.inputs.Audio(source="microphone", type="blob")
#         ],
#         outputs=[
#             "textbox", "text"
#         ],
#         live=True).launch()
