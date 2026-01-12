import time

from flask import Flask
from flask_cors import CORS
from flasgger import Swagger

from .config import Config
from .extensions import db, jwt
from .routes import register_blueprints


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config())

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    Swagger(app)
    register_blueprints(app)

    with app.app_context():
        for attempt in range(10):
            try:
                db.engine.connect().close()
                db.create_all()
                break
            except Exception:
                if attempt == 9:
                    raise
                time.sleep(1)

    return app
