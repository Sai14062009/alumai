# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from .config import settings
# from .routers import tickets, ai, assets, assistant
# from .database import init_db

# def create_app() -> FastAPI:
#     init_db()
#     app = FastAPI(
#         title=settings.app_name,
#         debug=settings.debug,
#         description="Industrial Maintenance AI Analysis Dashboard"
#     )

#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=settings.allowed_origins,
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

#     @app.get("/health", tags=["System"])
#     async def health_check() -> dict:
#         return {
#             "status": "online",
#             "app": settings.app_name,
#             "groq_configured": bool(settings.GROQ_API_KEY)  # ✅ fixed
#         }

#     app.include_router(tickets.router)
#     app.include_router(ai.router)
#     app.include_router(assets.router)
#     app.include_router(assistant.router)

#     return app

# app = create_app()

# if __name__ == "__main__":
#     import uvicorn
#     print(f"Starting {settings.app_name}...")
#     uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import tickets, ai, assets, assistant, auth
from .database import init_db

def create_app() -> FastAPI:
    init_db()
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        description="Industrial Maintenance AI Analysis Dashboard"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["System"])
    async def health_check() -> dict:
        return {
            "status": "online",
            "app": settings.app_name,
            "groq_configured": bool(settings.GROQ_API_KEY)
        }

    app.include_router(auth.router)
    app.include_router(tickets.router)
    app.include_router(ai.router)
    app.include_router(assets.router)
    app.include_router(assistant.router)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    print(f"Starting {settings.app_name}...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)