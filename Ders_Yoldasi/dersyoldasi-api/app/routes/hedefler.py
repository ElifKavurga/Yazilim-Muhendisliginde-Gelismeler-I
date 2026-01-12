from flask import Blueprint, request
from flasgger import swag_from

from ..extensions import db
from ..models import Hedef, Ders


hedefler_bp = Blueprint("hedefler", __name__)


def hedef_sozluk(hedef):
    return {
        "id": hedef.id,
        "ders_id": hedef.ders_id,
        "baslik": hedef.baslik,
        "hedef_saat": hedef.hedef_saat,
        "tamamlandi_mi": hedef.tamamlandi_mi,
    }


@hedefler_bp.post("")
@swag_from({
    "tags": ["Hedefler"],
    "summary": "Hedef olustur",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ders_id": {"type": "integer"},
                        "baslik": {"type": "string"},
                        "hedef_saat": {"type": "integer"},
                        "tamamlandi_mi": {"type": "boolean"},
                    },
                    "required": ["ders_id", "baslik", "hedef_saat"],
                }
            }
        },
    },
    "responses": {"201": {"description": "Hedef olustu"}, "400": {"description": "Dogrulama hatasi"}},
})
def hedef_ekle():
    veri = request.get_json(silent=True) or {}
    ders_id = veri.get("ders_id")
    baslik = veri.get("baslik")
    hedef_saat = veri.get("hedef_saat")
    tamamlandi_mi = veri.get("tamamlandi_mi", False)

    if ders_id is None or not baslik or hedef_saat is None:
        return {"hata": "ders_id, baslik ve hedef_saat gerekli"}, 400

    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 400

    hedef = Hedef(
        ders_id=ders_id,
        baslik=baslik,
        hedef_saat=int(hedef_saat),
        tamamlandi_mi=bool(tamamlandi_mi),
    )
    db.session.add(hedef)
    db.session.commit()

    return hedef_sozluk(hedef), 201


@hedefler_bp.get("")
@swag_from({
    "tags": ["Hedefler"],
    "summary": "Hedefleri listele",
    "responses": {"200": {"description": "Hedef listesi"}},
})
def hedefleri_listele():
    hedefler = Hedef.query.all()
    return [hedef_sozluk(hedef) for hedef in hedefler]


@hedefler_bp.get("/<int:hedef_id>")
@swag_from({
    "tags": ["Hedefler"],
    "summary": "Hedef getir",
    "responses": {"200": {"description": "Hedef detayi"}, "404": {"description": "Bulunamadi"}},
})
def hedef_getir(hedef_id):
    hedef = Hedef.query.get(hedef_id)
    if not hedef:
        return {"hata": "hedef bulunamadi"}, 404
    return hedef_sozluk(hedef)


@hedefler_bp.put("/<int:hedef_id>")
@swag_from({
    "tags": ["Hedefler"],
    "summary": "Hedef guncelle",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ders_id": {"type": "integer"},
                        "baslik": {"type": "string"},
                        "hedef_saat": {"type": "integer"},
                        "tamamlandi_mi": {"type": "boolean"},
                    },
                }
            }
        },
    },
    "responses": {"200": {"description": "Hedef guncellendi"}, "404": {"description": "Bulunamadi"}},
})
def hedef_guncelle(hedef_id):
    hedef = Hedef.query.get(hedef_id)
    if not hedef:
        return {"hata": "hedef bulunamadi"}, 404

    veri = request.get_json(silent=True) or {}
    if "ders_id" in veri:
        ders = Ders.query.get(veri["ders_id"])
        if not ders:
            return {"hata": "ders bulunamadi"}, 400
        hedef.ders_id = veri["ders_id"]
    if "baslik" in veri:
        hedef.baslik = veri["baslik"]
    if "hedef_saat" in veri:
        hedef.hedef_saat = int(veri["hedef_saat"])
    if "tamamlandi_mi" in veri:
        hedef.tamamlandi_mi = bool(veri["tamamlandi_mi"])

    db.session.commit()
    return hedef_sozluk(hedef)


@hedefler_bp.delete("/<int:hedef_id>")
@swag_from({
    "tags": ["Hedefler"],
    "summary": "Hedef sil",
    "responses": {"200": {"description": "Hedef silindi"}, "404": {"description": "Bulunamadi"}},
})
def hedef_sil(hedef_id):
    hedef = Hedef.query.get(hedef_id)
    if not hedef:
        return {"hata": "hedef bulunamadi"}, 404

    db.session.delete(hedef)
    db.session.commit()
    return {"durum": "silindi"}
