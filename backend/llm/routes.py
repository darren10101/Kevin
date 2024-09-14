from flask import Blueprint, request, jsonify, session
from settings import Settings
from llm.generation import GroqGenerator
from llm.prompts import Prompts
import json

settings = Settings()

groq_routes = Blueprint('groq', __name__)

@groq_routes.route('/generate', methods=['POST'])
def generate():
    groq_generator = GroqGenerator()
    raw_prompt = request.json.get('prompt')
    raw_html = request.json.get('old_html')
    raw_css = request.json.get('old_css')
    prompt = Prompts().generate_prompt(raw_prompt, raw_css, raw_html)
    res = groq_generator.generate(prompt)
    res_object = json.loads(res)
    return jsonify({'result': res_object}), 200

@groq_routes.route('/describe', methods=['POST'])
def describe():
    groq_generator = GroqGenerator()
    base64_image = request.json.get('image')
    res = groq_generator.describe(base64_image)
    return jsonify({'result': res}), 200