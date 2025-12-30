from flask import Blueprint, request
from flasgger import swag_from

from ..extensions import db
from ..models import Ogrenci, Ders


ogrenciler_bp = Blueprint("ogrenciler", __name__)


def ogrenci_sozluk(ogrenci):
    return {
        "id": ogrenci.id,
        "ad_soyad": ogrenci.ad_soyad,
        "email": ogrenci.email,
    }


def ders_sozluk(ders):
    return {
        "id": ders.id,
        "ogrenci_id": ders.ogrenci_id,
        "ders_adi": ders.ders_adi,
        "aciklama": ders.aciklama,
    }


@ogrenciler_bp.post("")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrenci olustur",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ad_soyad": {"type": "string"},
                        "email": {"type": "string"},
                    },
                    "required": ["ad_soyad", "email"],
                }
            }
        },
    },
    "responses": {"201": {"description": "Ogrenci olustu"}},
})
def ogrenci_ekle():
    veri = request.get_json(silent=True) or {}
    ad_soyad = veri.get("ad_soyad")
    email = veri.get("email")

    if not ad_soyad or not email:
        return {"hata": "ad_soyad ve email gerekli"}, 400

    ogrenci = Ogrenci(ad_soyad=ad_soyad, email=email)
    db.session.add(ogrenci)
    db.session.commit()

    return ogrenci_sozluk(ogrenci), 201


@ogrenciler_bp.get("")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrencileri listele",
    "responses": {"200": {"description": "Ogrenci listesi"}},
})
def ogrencileri_listele():
    ogrenciler = Ogrenci.query.all()
    return [ogrenci_sozluk(ogrenci) for ogrenci in ogrenciler]


@ogrenciler_bp.get("/<int:ogrenci_id>")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrenci getir",
    "responses": {"200": {"description": "Ogrenci detayi"}, "404": {"description": "Bulunamadi"}},
})
def ogrenci_getir(ogrenci_id):
    ogrenci = Ogrenci.query.get(ogrenci_id)
    if not ogrenci:
        return {"hata": "ogrenci bulunamadi"}, 404
    return ogrenci_sozluk(ogrenci)


@ogrenciler_bp.put("/<int:ogrenci_id>")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrenci guncelle",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ad_soyad": {"type": "string"},
                        "email": {"type": "string"},
                    },
                }
            }
        },
    },
    "responses": {"200": {"description": "Ogrenci guncellendi"}, "404": {"description": "Bulunamadi"}},
})
def ogrenci_guncelle(ogrenci_id):
    ogrenci = Ogrenci.query.get(ogrenci_id)
    if not ogrenci:
        return {"hata": "ogrenci bulunamadi"}, 404

    veri = request.get_json(silent=True) or {}
    if "ad_soyad" in veri:
        ogrenci.ad_soyad = veri["ad_soyad"]
    if "email" in veri:
        ogrenci.email = veri["email"]

    db.session.commit()
    return ogrenci_sozluk(ogrenci)


@ogrenciler_bp.delete("/<int:ogrenci_id>")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrenci sil",
    "responses": {"200": {"description": "Ogrenci silindi"}, "404": {"description": "Bulunamadi"}},
})
def ogrenci_sil(ogrenci_id):
    ogrenci = Ogrenci.query.get(ogrenci_id)
    if not ogrenci:
        return {"hata": "ogrenci bulunamadi"}, 404

    db.session.delete(ogrenci)
    db.session.commit()
    return {"durum": "silindi"}


@ogrenciler_bp.get("/<int:ogrenci_id>/dersler")
@swag_from({
    "tags": ["Ogrenciler"],
    "summary": "Ogrencinin dersleri",
    "responses": {"200": {"description": "Ders listesi"}, "404": {"description": "Bulunamadi"}},
})
def ogrenci_dersleri(ogrenci_id):
    ogrenci = Ogrenci.query.get(ogrenci_id)
    if not ogrenci:
        return {"hata": "ogrenci bulunamadi"}, 404

    dersler = Ders.query.filter_by(ogrenci_id=ogrenci_id).all()
    return [ders_sozluk(ders) for ders in dersler]
