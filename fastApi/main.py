from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

app = FastAPI()

def read_api_key():
    with open("api_keys.txt", "r") as file:
        api_key = file.readline().strip()
    return api_key

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  #origin of React app
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

import logging

def transcribe_audio(file_path):
    try:
        api_key=read_api_key()
        print("APi Key" ,api_key)
        # API endpoint configuration
        api_url = "https://transcribe.whisperapi.com"
        headers = {'Authorization': f'Bearer {api_key}'}

        # Payload setup for API request
        print("file"+file_path)
        logging.info("file path - {}",file_path)
        payload = {
            'file': {'file': open(file_path, 'rb')},
            'data':{
                "fileType": "wav",
                "diarization": "false",
                "numSpeakers": "2",
                "initialPrompt": "",
                "language": "en",
                "task": "transcribe",
                "callbackURL": ""
                }

        }

        logging.info("payload - {}",payload)
        # Make the API request
        response = requests.post(api_url, headers=headers, files=payload['file'], data=payload['data'])
   
        print( response.text)
       

        # Parse and return the transcription from the response
        if response.ok:
            transcription = response.json()['text']
            print("Transcription obtained:", transcription)  # Print the transcription
            return transcription
        else:
            logging.info("Failed to transcribe audio: %s", response.text)
            return "Failed to transcribe audio"
    except Exception as e:
        logging.error("Error transcribing audio: %s", e)
        print("Error transcribing audio:", e)  # Print the error
        return "Error transcribing audio"


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type.startswith("video/"):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # Check if the uploaded video file contains audio
        # If it does, transcribe the audio to text using Whisper API
        if os.path.exists(file_path):
            captions = transcribe_audio(file_path)
            return JSONResponse(content={"message": "File uploaded successfully", "file_path": file_path, "transcription": captions})
        else:
            return JSONResponse(status_code=400, content={"message": "Uploaded video file does not exist"})
    else:
        return JSONResponse(status_code=400, content={"message": "Only video files are allowed"})
