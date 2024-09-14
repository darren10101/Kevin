from llm.prompts import Prompts
from groq import Groq
from settings import Settings

class GroqGenerator:
    def __init__(self):
        groq_settings = Settings().groq_credentials
        self.system_prompt = Prompts().system
        self.client = Groq(api_key=groq_settings.apiKey)

    def generate(self, prompt):
        messages = [
            {
                "role": "system",
                "content": self.system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        completion = self.client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=messages,
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )
        result = ""
        for chunk in completion:
            result += chunk.choices[0].delta.content or ""
        
        return result
    
# groq_generator = GroqGenerator()
# prompt = """
# I want a header saying \"MY STORE\" in italics, centered, with a blue background. Under it is a styled list in a flexbox that shows example products. Use whatever placeholder values.\n
# """

# res = groq_generator.generate(prompt)
# print(res)