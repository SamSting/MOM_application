import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from helper import summarize_text, transcribe_audio

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # origin of React app
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure logging
logging.basicConfig(level=logging.INFO)

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

            # Summarize the transcription
            summarized_captions = summarize_text(captions)

            # Log the summary
            logging.info("Summary generated: %s", summarized_captions)

            # Return summary along with other information
            return JSONResponse(content={"message": "File uploaded successfully", "file_path": file_path, "transcription": captions, "summary": summarized_captions, "log_info": f"Summary generated: {summarized_captions}"})
        else:
            return JSONResponse(status_code=400, content={"message": "Uploaded video file does not exist"})
    else:
        return JSONResponse(status_code=400, content={"message": "Only video files are allowed"})
