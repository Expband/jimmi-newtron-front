from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request
from fastapi.templating import \
Jinja2Templates
from fastapi.responses import HTMLResponse
import uvicorn
import os
from dotenv import load_dotenv


app = FastAPI()
load_dotenv()
app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')


@app.get('/waiting', response_class=HTMLResponse)
async def waiting(request: Request):
    return templates.TemplateResponse('waiting.html', context={'request': request})
@app.get('/login', response_class=HTMLResponse)
async def waiting(request: Request):
    return templates.TemplateResponse('login.html', context={'request': request})

@app.get('/', response_class=HTMLResponse)
async def main(request: Request):
    return templates.TemplateResponse('home.html', context={'request': request})


if __name__ == '__main__':
    port = os.getenv('PORT')
    uvicorn.run('main:app', port=9090)
