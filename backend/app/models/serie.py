from database import Base
from sqlalchemy import Column, String, Integer, ForeignKey


class Serie(Base):
    """
    SQLAlchemy model representing a TV series.
    Maps to the 'series' table in the database.
    Foreign key to the 'users' table.
    """
    __tablename__ = "series"

    id = Column(Integer, primary_key=True, index=True)    
    title = Column(String, nullable=False)
    imdbID = Column(String, nullable=False, unique=True, index=True)    
    year = Column(String, nullable=True)
    rated = Column(String, nullable=True)
    released = Column(String, nullable=True)
    runtime = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    director = Column(String, nullable=True)
    writer = Column(String, nullable=True)
    actors = Column(String, nullable=True)
    plot = Column(String, nullable=True)
    language = Column(String, nullable=True)
    country = Column(String, nullable=True)
    awards = Column(String, nullable=True)
    poster = Column(String, nullable=True)
    metascore = Column(String, nullable=True)
    imdbRating = Column(String, nullable=True)
    imdbVotes = Column(String, nullable=True)
    totalSeasons = Column(String, nullable=True)
    owner_id = Column(Integer,  ForeignKey("users.id"))
