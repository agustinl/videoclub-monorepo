from typing import Annotated

from database import SessionLocal
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from models.serie import Serie
from .auth import get_current_user
from sqlalchemy.orm import Session
import re

load_dotenv()

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/stats")
def get_stats(db: db_dependency):
	series = db.query(Serie).all()

	series_by_release_year = {}
	series_by_imdb_rating = {}
	series_by_total_seasons = {}
	series_by_genre = {}

	for serie in series:
		if serie.released:
			year = re.findall(r'\d{4}', serie.released)[0]
			series_by_release_year[year] = series_by_release_year.get(year, 0) + 1
		if serie.imdbRating:
			series_by_imdb_rating[serie.imdbRating] = series_by_imdb_rating.get(serie.imdbRating, 0) + 1
		if serie.totalSeasons:
			series_by_total_seasons[serie.totalSeasons] = series_by_total_seasons.get(serie.totalSeasons, 0) + 1
		if serie.genre:	
			genre = serie.genre.split(', ')[0]
			series_by_genre[genre] = series_by_genre.get(genre, 0) + 1

	average_imdb_rating = sum(float(rating) for rating in series_by_imdb_rating.keys()) / len(series_by_imdb_rating)
	most_popular_year = max(series_by_release_year, key=series_by_release_year.get)
	average_total_seasons = sum(int(seasons) for seasons in series_by_total_seasons.keys()) / len(series_by_total_seasons)
	series_with_rating_8_or_higher = sum(value for key, value in series_by_imdb_rating.items() if float(key) >= 8)

	if not series:
		raise HTTPException(status_code=404, detail="No series found")
    
	return {
		"series_by_release_year": dict(sorted(series_by_release_year.items())),
		"series_by_imdb_rating": dict(sorted(series_by_imdb_rating.items())),
		"series_by_total_seasons": dict(sorted(series_by_total_seasons.items())),
		"average_imdb_rating": average_imdb_rating,
		"most_popular_year": most_popular_year,
		"average_total_seasons": average_total_seasons,
		"series_with_rating_8_or_higher": series_with_rating_8_or_higher,
		"total_series_count": len(series),
		"series_by_genre": dict(sorted(series_by_genre.items())),
	}