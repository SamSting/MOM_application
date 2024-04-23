from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this with the origin of your React app
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type.startswith("video/"):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        return JSONResponse(content={"message": "File uploaded successfully", "file_path": file_path})
    else:
        return JSONResponse(status_code=400, content={"message": "Only video files are allowed"})
