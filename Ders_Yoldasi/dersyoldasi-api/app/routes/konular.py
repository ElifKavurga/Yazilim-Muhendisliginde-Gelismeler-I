from flask import Blueprint, request
from flasgger import swag_from

from ..extensions import db
from ..models import Konu, Ders


konular_bp = Blueprint("konular", __name__)


def konu_sozluk(konu):
    return {
        "id": konu.id,
        "ders_id": konu.ders_id,
        "konu_adi": konu.konu_adi,
        "tamamlandi_mi": konu.tamamlandi_mi,
        "notlar": konu.notlar,
        "zorluk": konu.zorluk,
    }


@konular_bp.post("")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konu olustur",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ders_id": {"type": "integer"},
                        "konu_adi": {"type": "string"},
                        "notlar": {"type": "string"},
                        "zorluk": {"type": "integer"},
                    },
                    "required": ["ders_id", "konu_adi"],
                }
            }
        },
    },
    "responses": {"201": {"description": "Konu olustu"}, "400": {"description": "Dogrulama hatasi"}},
})
def konu_ekle():
    veri = request.get_json(silent=True) or {}
    ders_id = veri.get("ders_id")
    konu_adi = veri.get("konu_adi")
    notlar = veri.get("notlar")
    zorluk = veri.get("zorluk", 1)

    if ders_id is None or not konu_adi:
        return {"hata": "ders_id ve konu_adi gerekli"}, 400

    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 400

    konu = Konu(
        ders_id=ders_id,
        konu_adi=konu_adi,
        notlar=notlar,
        zorluk=int(zorluk),
    )
    db.session.add(konu)
    db.session.commit()

    return konu_sozluk(konu), 201


@konular_bp.get("")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konulari listele",
    "responses": {"200": {"description": "Konu listesi"}},
})
def konulari_listele():
    konular = Konu.query.all()
    return [konu_sozluk(konu) for konu in konular]


@konular_bp.get("/<int:konu_id>")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konu getir",
    "responses": {"200": {"description": "Konu detayi"}, "404": {"description": "Bulunamadi"}},
})
def konu_getir(konu_id):
    konu = Konu.query.get(konu_id)
    if not konu:
        return {"hata": "konu bulunamadi"}, 404
    return konu_sozluk(konu)


@konular_bp.put("/<int:konu_id>")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konu guncelle",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ders_id": {"type": "integer"},
                        "konu_adi": {"type": "string"},
                        "tamamlandi_mi": {"type": "boolean"},
                        "notlar": {"type": "string"},
                        "zorluk": {"type": "integer"},
                    },
                }
            }
        },
    },
    "responses": {"200": {"description": "Konu guncellendi"}, "404": {"description": "Bulunamadi"}},
})
def konu_guncelle(konu_id):
    konu = Konu.query.get(konu_id)
    if not konu:
        return {"hata": "konu bulunamadi"}, 404

    veri = request.get_json(silent=True) or {}
    if "ders_id" in veri:
        ders = Ders.query.get(veri["ders_id"])
        if not ders:
            return {"hata": "ders bulunamadi"}, 400
        konu.ders_id = veri["ders_id"]
    if "konu_adi" in veri:
        konu.konu_adi = veri["konu_adi"]
    if "tamamlandi_mi" in veri:
        konu.tamamlandi_mi = bool(veri["tamamlandi_mi"])
    if "notlar" in veri:
        konu.notlar = veri["notlar"]
    if "zorluk" in veri:
        konu.zorluk = int(veri["zorluk"])

    db.session.commit()
    return konu_sozluk(konu)


@konular_bp.patch("/<int:konu_id>/toggle")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konu tamamlandi durumunu degistir",
    "responses": {"200": {"description": "Konu guncellendi"}, "404": {"description": "Bulunamadi"}},
})
def konu_toggle(konu_id):
    konu = Konu.query.get(konu_id)
    if not konu:
        return {"hata": "konu bulunamadi"}, 404

    konu.tamamlandi_mi = not konu.tamamlandi_mi
    db.session.commit()
    return konu_sozluk(konu)


@konular_bp.delete("/<int:konu_id>")
@swag_from({
    "tags": ["Konular"],
    "summary": "Konu sil",
    "responses": {"200": {"description": "Konu silindi"}, "404": {"description": "Bulunamadi"}},
})
def konu_sil(konu_id):
    konu = Konu.query.get(konu_id)
    if not konu:
        return {"hata": "konu bulunamadi"}, 404

    db.session.delete(konu)
    db.session.commit()
    return {"durum": "silindi"}
