from flask import Blueprint, Flask, request, send_file, jsonify
import requests
import os
from io import BytesIO

tts_routes = Blueprint('tts', __name__)

# Load ElevenLabs API key from environment
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
SAVE_DIR = 'downloads' 
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

@tts_routes.route('/generate-audio', methods=['POST'])
def generate_audio():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'Text is required'}), 400

    text = data['text']

    # Make request to ElevenLabs API
    headers = {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
    }

    # Use the correct ElevenLabs API URL and pass the voice ID in the URL
    api_url = f'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb'

    payload = {
        'text': text,
        'voice_settings': {
            'stability': 0.75,
            'similarity_boost': 0.75
        }
    }

    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code == 200:
        audio_content = response.content
            
        # Ensure that the content is not empty
        if not audio_content:
            return jsonify({'error': 'Received empty audio content'}), 500

        audio_file = BytesIO(audio_content)
            
            # Properly set the mimetype for the audio file

        print('sending file')
        return send_file(audio_file, mimetype='audio/mpeg')
    else:
        print(f"Error from ElevenLabs API: {response.status_code} - {response.text}")
        return jsonify({'error': 'Failed to generate audio', 'details': response.json()}), 500

