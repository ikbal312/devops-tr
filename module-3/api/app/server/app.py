from fastapi import FastAPI
from decouple import config
from server.routes.student import router as StudentRouter
API_ROOT_PATH = config("API_ROOT_PATH")  # read environment variable
app = FastAPI( docs_url="/",redoc_url=None,root_path=API_ROOT_PATH)

app.include_router(StudentRouter, tags=["Student"], prefix="/student")
