# def main():
#     print("Hello from chatbot!")
from langchain.text_splitter import RecursiveChacracterTextSplitter
from langchain.community.vectorstores import Chroma
from langchain.community.document_loaders import PyPDFLoader
from langchain.chain import RetrievalQA
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.post("/chatbot/read_manual"):
def async read_manual(req: ReadManualRequest)
    return Ok()

