import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # <- important to load API key

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY not found in .env")

client = Groq(api_key=GROQ_API_KEY)

# Load personality prompt
with open("prompt.txt", "r", encoding="utf-8") as f:
    PERSONALITY_PROMPT = f.read()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    text: str

PREDEFINED_ANSWERS = {
    "life story": "life-story.mp3",
    "your life story": "life-story.mp3",
    "superpower": "superpower.mp3",
    "top 3 areas": "growth-areas.mp3",
    "areas you'd like to grow": "growth-areas.mp3",
    "misconception": "misunderstanding.mp3",
    "coworkers think": "misunderstanding.mp3",
    "boundaries": "boundaries.mp3",
    "limits": "boundaries.mp3"
}

def detect_predefined_answer(user_text: str):
    text = user_text.lower()
    for key in PREDEFINED_ANSWERS:
        if key in text:
            return PREDEFINED_ANSWERS[key]
    return None

@app.post("/ask")
async def ask_question(q: Question):
    user_text = q.text.strip()

    # Pre-recorded MP3
    audio_file = detect_predefined_answer(user_text)
    if audio_file:
        return {"type": "audio", "file": audio_file}

    # Call Groq LLM
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": PERSONALITY_PROMPT},
                {"role": "user", "content": user_text}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=300
        )
        answer = completion.choices[0].message.content
        return {"type": "text", "text": answer}

    except Exception as e:
        return {"type": "text", "text": f"Error: {str(e)}"}
