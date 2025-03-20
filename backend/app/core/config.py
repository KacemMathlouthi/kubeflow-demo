from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Frontend Config
    FRONTEND_URL: str

    # Weaviate Config
    WEAVIATE_HOST: str
    WEAVIATE_PORT: int
    WEAVIATE_API_KEY: str

    # Groq Config
    GROQ_API_KEY: str

    # Selected LLM Model
    LLM_MODEL: str

    class Config:
        env_file = ".env"
        cache_on_load = False


settings = Settings()
