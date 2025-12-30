import os


class Config:
    def __init__(self):
        user = os.getenv("POSTGRES_USER", "ders_user")
        password = os.getenv("POSTGRES_PASSWORD", "ders_pass")
        host = os.getenv("POSTGRES_HOST", "db")
        port = os.getenv("POSTGRES_PORT", "5432")
        database = os.getenv("POSTGRES_DB", "ders_db")
        default_uri = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"

        self.SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", default_uri)
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
        self.SWAGGER = {
            "title": "Ders Yoldasi API",
            "uiversion": 3,
            "openapi": "3.0.2",
        }
