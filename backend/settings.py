import os
from pydantic import BaseModel, Field

class FirebaseCredentials(BaseModel):
    apiKey: str = Field(default_factory=lambda: os.getenv("FIREBASE_API_KEY", ""))
    authDomain: str = Field(default_factory=lambda: os.getenv("FIREBASE_AUTH_DOMAIN", ""))
    projectId: str = Field(default_factory=lambda: os.getenv("FIREBASE_PROJECT_ID", ""))
    storageBucket: str = Field(default_factory=lambda: os.getenv("FIREBASE_STORAGE_BUCKET", ""))
    messagingSenderId: str = Field(default_factory=lambda: os.getenv("FIREBASE_MESSAGING_SENDER_ID", ""))
    appId: str = Field(default_factory=lambda: os.getenv("FIREBASE_APP_ID", ""))
    databaseURL: str = Field(default_factory=lambda: os.getenv("FIREBASE_DATABASE_URL", ""))

class GroqCredentials(BaseModel):
    apiKey: str = Field(default_factory=lambda: os.getenv("GROQ_API_KEY", ""))
    
class ElevenLabsCredentials(BaseModel):
    apiKey: str = Field(default_factory=lambda: os.getenv("ELEVENLABS_API_KEY", ""))
    

class Settings:
    firebase_credentials: FirebaseCredentials = FirebaseCredentials()
    groq_credentials: GroqCredentials = GroqCredentials()
    eleven_credentials: ElevenLabsCredentials = ElevenLabsCredentials()
