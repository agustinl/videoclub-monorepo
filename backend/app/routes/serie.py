import os
from typing import Annotated

import httpx
from database import SessionLocal
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from models.serie import Serie
from .auth import get_current_user
from pydantic import BaseModel
from sqlalchemy.orm import Session, load_only
from starlette import status

load_dotenv()

router = APIRouter(
    prefix="/series",
    tags=["series"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class CreateSerieRequest(BaseModel):
    Title: str
    imdbID: str
    Year: str | None = None
    Rated: str | None = None
    Released: str | None = None
    Runtime: str | None = None
    Genre: str | None = None
    Director: str | None = None
    Writer: str | None = None
    Actors: str | None = None
    Plot: str | None = None
    Language: str | None = None
    Country: str | None = None
    Awards: str | None = None
    Poster: str | None = None
    Metascore: str | None = None
    imdbRating: str | None = None
    imdbVotes: str | None = None
    totalSeasons: str | None = None

OMDB_URL = "http://www.omdbapi.com/?type=series&plot=full"
OMDB_API_KEY = os.getenv("OMDB_API_KEY")

def get_series_titles(db: Session):
    series_titles = db.query(Serie).options(
        load_only(Serie.title)
    ).all()

    series_titles = [serie.title for serie in series_titles]
    
    return series_titles

@router.get("/all")
def get_all_series(db: db_dependency):
    series = db.query(Serie).options(
        load_only(Serie.title, Serie.year, Serie.poster, Serie.imdbID)
    ).all()

    if not series:
        raise HTTPException(status_code=404, detail="No series found")
    
    return series


@router.get("/search", status_code=status.HTTP_200_OK)
async def get_serie_by_name(name: str, user: user_dependency):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            OMDB_URL, params={"t": name, "apikey": OMDB_API_KEY}
        )
        data = response.json()

        if data.get("Response") == "False":
            raise HTTPException(status_code=404, detail=data.get("Error"))

        return data


@router.get("/{imdbID}", status_code=status.HTTP_200_OK)
async def get_serie_by_imdbID(imdbID: str, db: db_dependency):
    serie = db.query(Serie).filter(Serie.imdbID == imdbID).first()

    if not serie:
        raise HTTPException(status_code=404, detail="Serie not found")

    return serie

@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_serie(serie: CreateSerieRequest, db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    if not serie:
        raise HTTPException(status_code=400, detail="Serie not found")

    new_serie = Serie(
        title=serie.Title,
        year=serie.Year or None,
        rated=serie.Rated or None,
        released=serie.Released or None,
        runtime=serie.Runtime or None,
        genre=serie.Genre or None,
        director=serie.Director or None,
        writer=serie.Writer or None,
        actors=serie.Actors or None,
        plot=serie.Plot or None,
        language=serie.Language or None,
        country=serie.Country or None,
        awards=serie.Awards or None,
        poster=serie.Poster or None,
        metascore=serie.Metascore or None,
        imdbRating=serie.imdbRating or None,
        imdbVotes=serie.imdbVotes or None,
        imdbID=serie.imdbID,
        totalSeasons=serie.totalSeasons or None,
		owner_id=user.get('id'),
    )

    db.add(new_serie)
    db.commit()
    return {"imdbID": new_serie.imdbID}