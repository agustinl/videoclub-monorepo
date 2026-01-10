import os
from typing import Annotated

from database import SessionLocal
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from routes.serie import get_series_titles
from sqlalchemy.orm import Session

from .auth import get_current_user

load_dotenv()

router = APIRouter(
    prefix="/assistant",
    tags=["assistant"],
)

# Check if Gemini API key is configured
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/assistant")
def get_recommendations(db: db_dependency, user: user_dependency):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI Assistant is not available. GEMINI API KEY is required for local development.",
        )

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    template = """
    You are a helpful assistant that recommends series to watch. Based on my list of series, recommend the next best series to watch.
    Series: {series}
    Recommend the next best series to watch based on the series list.
    Return the series title and explain why you recommended it.
    """

    summary_prompt_template = PromptTemplate(
        input_variables=["series"], template=template
    )

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

    chain = summary_prompt_template | model

    series_titles = get_series_titles(db)
    titles = ", ".join(series_titles)

    response = chain.invoke(input={"series": titles})

    return response.content
