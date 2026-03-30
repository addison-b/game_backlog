from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Game(BaseModel):
    title: str
    genre: str
    played: bool = False


games = [
    {"id": 1, "title": "Hollow Knight", "genre": "Metroidvania", "played": False},
    {"id": 2, "title": "Disco Elysium", "genre": "RPG", "played": False},
    {"id": 3, "title": "Celeste", "genre": "Platformer", "played": True},
]


@app.get("/")
def root():
    return {"message": "Backlog API is running"}


@app.get("/games")
def get_games(played: bool = None):
    return [g for g in games if g["played"] == played] if played is not None else games


@app.get("/games/{game_id}")
def get_game_id(game_id: int):
    game = next((g for g in games if g["id"] == game_id), None)
    if game:
        return game
    else:
        raise HTTPException(status_code=404, detail="Game not found.")


@app.post("/games")
def add_game(game: Game):
    new_game = game.model_dump()
    new_game["id"] = len(games) + 1
    games.append(new_game)
    return new_game


@app.delete("/games/{id}")
def delete_game(game_id: int):
    games[:] = [g for g in games if g["id"] != game_id]
    return {"message": "Deleted"}
