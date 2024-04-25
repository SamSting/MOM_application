import os
import requests
import logging
from transformers import BartTokenizer, BartForConditionalGeneration

def read_api_key():
    with open("api_keys.txt", "r") as file:
        api_key = file.readline().strip()
    return api_key

def transcribe_audio(file_path):
    try:
        api_key = read_api_key()
        # API endpoint configuration
        api_url = "https://transcribe.whisperapi.com"
        headers = {'Authorization': f'Bearer {api_key}'}

        # Payload setup for API request
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

        # Make the API request
        response = requests.post(api_url, headers=headers, files=payload['file'], data=payload['data'])

        # Parse and return the transcription from the response
        if response.ok:
            transcription = response.json()['text']
            return transcription
        else:
            logging.error("Failed to transcribe audio: %s", response.text)
            return "Failed to transcribe audio"
    except Exception as e:
        logging.error("Error transcribing audio: %s", e)
        return "Error transcribing audio"


def summarize_text(text):
    # Load the BART tokenizer and model
    tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

    # Tokenize the text
    inputs = tokenizer([text], max_length=1024, return_tensors='pt', truncation=True)

    # Generate summary
    summary_ids = model.generate(inputs['input_ids'], num_beams=4, min_length=30, max_length=200, early_stopping=True)
    
    # Decode the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    
	

    return summary