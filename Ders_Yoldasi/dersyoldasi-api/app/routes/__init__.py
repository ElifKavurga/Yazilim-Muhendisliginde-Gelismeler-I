from .kimlik import kimlik_bp
from .ogrenciler import ogrenciler_bp
from .dersler import dersler_bp
from .hedefler import hedefler_bp
from .konular import konular_bp


def register_blueprints(app):
    app.register_blueprint(kimlik_bp, url_prefix="/kimlik")
    app.register_blueprint(ogrenciler_bp, url_prefix="/api/ogrenciler")
    app.register_blueprint(dersler_bp, url_prefix="/api/dersler")
    app.register_blueprint(hedefler_bp, url_prefix="/api/hedefler")
    app.register_blueprint(konular_bp, url_prefix="/api/konular")

    @app.get("/saglik")
    def saglik_kontrol():
        return {"durum": "ok"}
