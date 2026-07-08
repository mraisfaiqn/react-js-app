import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="AI-Translator")

# Allow the Vite/React dev server to call this API from the browser.
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  allow_methods=["*"],
  allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", api_key=GEMINI_API_KEY)

class TranslateRequest(BaseModel):
  input_language: str
  output_language: str
  user_input: str

class TranslateResponse(BaseModel):
  user_output: str

@app.post("/translate", response_model = TranslateResponse)
def translate(request: TranslateRequest):
  prompt = ChatPromptTemplate.from_messages([
    (
      "system",
      "You are a helpful assistant that translates {input_lang} to {output_lang}. "
      "Respond with only the translated text, no explanations.",
    ),
    (
      "human",
      "{user_input}",
    ),
  ])

  try:
    input_chain = prompt | llm | StrOutputParser()
    ai_response = input_chain.invoke({
      "input_lang": request.input_language,
      "output_lang": request.output_language,
      "user_input": request.user_input,
    })
  except Exception as e:
    raise HTTPException(status_code=502, detail=f"Translation failed: {e}")

  return TranslateResponse(user_output = ai_response)