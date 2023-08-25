import os
from flask import Flask, request, jsonify
import openai
from langchain.llms import OpenAI
from langchain.agents import AgentType, initialize_agent, load_tools

app = Flask(__name__)
from flask_cors import CORS  

CORS(app)  

SECRET_KEY = os.getenv("OPENAI_API_KEY")
@app.route('/get_summary', methods=['POST'])
def get_summary():
    data = request.json
    title = data.get('title', '')

    llm = OpenAI(temperature=0.7)
    tools = load_tools(["wikipedia", "llm-math"], llm=llm)
    agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
    
    output = agent.run(f"Summarize the entire page with the following title on Wikipedia, ensure that there are no incomplete sentences: {title}")
    
    return jsonify({"summary": output})

if __name__ == '__main__':
    app.run(debug=True)



# import os
# from flask import Flask, request, jsonify
# from langchain.llms import OpenAI
# from langchain.agents import AgentType, initialize_agent, load_tools
# from werkzeug.utils import secure_filename
# import tempfile
# import whisper
# import gradio as gr

# app = Flask(__name__)
# from flask_cors import CORS  

# CORS(app)  

# SECRET_KEY = os.getenv("OPENAI_API_KEY")

# # Load the Whisper ASR model
# model = whisper.load_model("small")

# # Initialize the OpenAI LLM
# llm = OpenAI(temperature=0.7)

# # Load tools for LLM
# tools = load_tools(["wikipedia", "llm-math"], llm=llm)

# # Initialize the agent
# agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

# @app.route('/get_summary', methods=['POST'])
# def get_summary():
#     data = request.json
#     title = data.get('title', '')

#     output = agent.run(f"Summarize the entire page with the following title on Wikipedia, ensure that there are no incomplete sentences: {title}")
    
#     return jsonify({"summary": output})

# @app.route('/transcribe_audio', methods=['POST'])
# def transcribe_audio():
#     audio = request.files.get('audio')

#     # Save the audio temporarily
#     temp_dir = tempfile.gettempdir()
#     audio_path = os.path.join(temp_dir, secure_filename(audio.filename))
#     audio.save(audio_path)

#     audio = whisper.load_audio(audio_path)
#     audio = whisper.pad_or_trim(audio)
#     mel = whisper.log_mel_spectrogram(audio).to(model.device)

#     _, probs = model.detect_language(mel)
#     detected_language = max(probs, key=probs.get)

#     options = whisper.DecodingOptions(fp16=False)
#     result = whisper.decode(model, mel, options)

#     return jsonify({"transcription": result.text, "language": detected_language})

# if __name__ == '__main__':
#     # Launch Gradio interface
#     gr.Interface(
#         title='OpenAI Whisper ASR Gradio Web UI',
#         fn=transcribe_audio,
#         inputs=[
#             gr.inputs.Audio(source="microphone", type="filepath")
#         ],
#         outputs=[
#             "textbox"
#         ],
#         live=True).launch()

#     # Run the Flask app
#     app.run(debug=True)










# from flask import Flask, request, jsonify, render_template
# import urllib.request
# import bs4 as bs
# import openai

# from flask_cors import CORS  # Import the CORS module

# app = Flask(__name__)
# CORS(app)  

# # Set your OpenAI API key
# openai.api_key = "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"

# @app.route('/get_summary', methods=['GET'])
# def get_summary():
#     source = urllib.request.urlopen('https://en.wikipedia.org/wiki/Taj_Mahal').read()

#     soup = bs.BeautifulSoup(source, 'lxml')

#     text = ""
#     for paragraph in soup.find_all('p'):
#         text += paragraph.text + "\n"

#     system_message = "You are a research assistant. Your summary should avoid incomplete sentences and be clear and concise."
#     prompt = f"{system_message}\nSummarize the most important details and main information from the entire text:\n{text[:1300]}"

#     response = openai.Completion.create(
#         engine="davinci",
#         prompt=prompt,
#         max_tokens=200
#     )

#     summary = response.choices[0].text.strip()

#     # Remove content after the last full stop
#     last_period_index = summary.rfind('.')
#     final_summary = summary[:last_period_index + 1]

#     # Remove extra spaces between words
#     final_summary = " ".join(final_summary.split())

#     return jsonify({"summary": final_summary})

# if __name__ == '__main__':
#     app.run(debug=True)
