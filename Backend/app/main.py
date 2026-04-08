from fastapi import FastAPI
from app.routes import auth,user,rate_limit_rule,request_log
from .middleware.request_logger import RequestLoggerMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



app.add_middleware(RequestLoggerMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(rate_limit_rule.router)
app.include_router(request_log.router)