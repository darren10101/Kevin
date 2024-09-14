from flask import Blueprint, request, jsonify, session
from settings import Settings
from llm.generation import GroqGenerator


settings = Settings()

groq_routes = Blueprint('groq', __name__)

@groq_routes.route('/generate', methods=['POST'])
def generate():
    groq_generator = GroqGenerator()
    prompt = request.json.get('prompt')
    res = groq_generator.generate(prompt)
    return jsonify({'result': res}), 200

