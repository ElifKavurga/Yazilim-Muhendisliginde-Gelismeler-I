from flask import Blueprint, request
from flasgger import swag_from
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from ..models import Ogrenci, Kullanici


kimlik_bp = Blueprint("kimlik", __name__)


def ogrenci_sozluk(ogrenci):
    return {
        "id": ogrenci.id,
        "ad_soyad": ogrenci.ad_soyad,
        "email": ogrenci.email,
    }


@kimlik_bp.post("/kayit")
@swag_from({
    "tags": ["Kimlik"],
    "summary": "Kullanici ve ogrenci kaydi",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "kullanici_adi": {"type": "string"},
                        "sifre": {"type": "string"},
                        "ad_soyad": {"type": "string"},
                        "email": {"type": "string"},
                    },
                    "required": ["kullanici_adi", "sifre", "ad_soyad", "email"],
                }
            }
        },
    },
    "responses": {
        "201": {"description": "Kayit olustu"},
        "400": {"description": "Dogrulama hatasi"},
    },
})
def kayit():
    veri = request.get_json(silent=True) or {}
    kullanici_adi = veri.get("kullanici_adi")
    sifre = veri.get("sifre")
    ad_soyad = veri.get("ad_soyad")
    email = veri.get("email")

    if not kullanici_adi or not sifre or not ad_soyad or not email:
        return {"hata": "kullanici_adi, sifre, ad_soyad ve email gerekli"}, 400

    if Kullanici.query.filter_by(kullanici_adi=kullanici_adi).first():
        return {"hata": "kullanici_adi zaten var"}, 400

    if Ogrenci.query.filter_by(email=email).first():
        return {"hata": "email zaten var"}, 400

    ogrenci = Ogrenci(ad_soyad=ad_soyad, email=email)
    kullanici = Kullanici(
        kullanici_adi=kullanici_adi,
        sifre_hash=generate_password_hash(sifre),
        ogrenci=ogrenci,
    )
    db.session.add_all([ogrenci, kullanici])
    db.session.commit()

    jeton = create_access_token(identity=str(kullanici.id))
    return {
        "erisim_jetonu": jeton,
        "kullanici_adi": kullanici.kullanici_adi,
        "ogrenci": ogrenci_sozluk(ogrenci),
    }, 201


@kimlik_bp.post("/giris")
@swag_from({
    "tags": ["Kimlik"],
    "summary": "Kullanici girisi",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "kullanici_adi": {"type": "string"},
                        "sifre": {"type": "string"},
                    },
                    "required": ["kullanici_adi", "sifre"],
                }
            }
        },
    },
    "responses": {
        "200": {"description": "Giris basarili"},
        "401": {"description": "Hatali bilgiler"},
    },
})
def giris():
    veri = request.get_json(silent=True) or {}
    kullanici_adi = veri.get("kullanici_adi")
    sifre = veri.get("sifre")

    if not kullanici_adi or not sifre:
        return {"hata": "kullanici_adi ve sifre gerekli"}, 400

    kullanici = Kullanici.query.filter_by(kullanici_adi=kullanici_adi).first()
    if not kullanici or not check_password_hash(kullanici.sifre_hash, sifre):
        return {"hata": "hatali bilgiler"}, 401

    jeton = create_access_token(identity=str(kullanici.id))
    return {
        "erisim_jetonu": jeton,
        "kullanici_adi": kullanici.kullanici_adi,
        "ogrenci": ogrenci_sozluk(kullanici.ogrenci),
    }


@kimlik_bp.get("/ben")
@jwt_required()
@swag_from({
    "tags": ["Kimlik"],
    "summary": "Mevcut kullanici",
    "responses": {"200": {"description": "Kullanici"}},
})
def ben():
    kullanici_id = get_jwt_identity()
    kullanici = Kullanici.query.get(kullanici_id)
    if not kullanici:
        return {"hata": "kullanici bulunamadi"}, 404
    return {
        "id": kullanici.id,
        "kullanici_adi": kullanici.kullanici_adi,
        "ogrenci": ogrenci_sozluk(kullanici.ogrenci),
    }


@kimlik_bp.get("/korumali")
@jwt_required()
@swag_from({
    "tags": ["Kimlik"],
    "summary": "Korumali endpoint",
    "responses": {"200": {"description": "Yetkili"}},
})
def korumali():
    return {"durum": "ok"}
