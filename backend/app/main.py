from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, user, test, result

# Create database tables
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Alpha - AI Test Platform API",
    description="AI-powered online testing platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(test.router)
app.include_router(result.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Alpha - AI Test Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}