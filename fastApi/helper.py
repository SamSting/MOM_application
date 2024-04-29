import os  # Importing the os module for operating system functionalities
import requests  # Importing the requests module for making HTTP requests
import logging  # Importing the logging module for logging messages
from transformers import BartTokenizer, BartForConditionalGeneration  # Importing classes from the transformers library

# Configure logging
logging.basicConfig(level=logging.INFO)  # Setting up logging configuration

def read_api_key():
    try:
        with open("api_keys.txt", "r") as file:  # Opening the file containing API keys
            api_key = file.readline().strip()  # Reading the API key from the file
        return api_key  # Returning the API key
    except Exception as e:
        logging.error("Error reading API key: %s", e)  # Logging an error message if reading API key fails
        return None  # Returning None if there's an error

def transcribe_audio(file_path):
    try:
        api_key = read_api_key()  # Getting the API key
        if not api_key:
            logging.error("API key not found.")  # Logging an error message if API key is not found
            return "API key not found"  # Returning a message if API key is not found

        api_url = "https://transcribe.whisperapi.com"  # API URL for transcription service
        headers = {'Authorization': f'Bearer {api_key}'}  # Headers for authentication

        with open(file_path, 'rb') as file:  # Opening the audio file
            files = {'file': file}  # Creating a dictionary of files to upload
            data = {
                "fileType": "wav",
                "diarization": "false",
                "numSpeakers": "2",
                "initialPrompt": "",
                "language": "en",
                "task": "transcribe",
                "callbackURL": ""
            }  # Data to be sent along with the request
            response = requests.post(api_url, headers=headers, files=files, data=data)  # Sending POST request to the API

        if response.ok:
            transcription = response.json().get('text', '')  # Extracting transcription from response
            return transcription  # Returning the transcription
        else:
            logging.error("Failed to transcribe audio: %s", response.text)  # Logging an error message if transcription fails
            return "Failed to transcribe audio"  # Returning a message if transcription fails
    except Exception as e:
        logging.error("Error transcribing audio: %s", e)  # Logging an error message if an error occurs
        return "Error transcribing audio"  # Returning a message if an error occurs

def summarize_text(text):
    try:
        tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')  # Initializing the BART tokenizer
        model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')  # Initializing the BART model
        inputs = tokenizer([text], max_length=1024, return_tensors='pt', truncation=True)  # Tokenizing the input text
        summary_ids = model.generate(inputs['input_ids'], num_beams=4, min_length=30, max_length=200, early_stopping=True)  # Generating summary
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)  # Decoding the summary
        return summary  # Returning the summary
    except Exception as e:
        logging.error("Error summarizing text: %s", e)  # Logging an error message if summarization fails
        return "Error summarizing text"  # Returning a message if summarization fails
