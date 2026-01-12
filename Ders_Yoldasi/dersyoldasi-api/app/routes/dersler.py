from flask import Blueprint, request
from flasgger import swag_from

from ..extensions import db
from ..models import Ders, Ogrenci, Hedef, Konu


dersler_bp = Blueprint("dersler", __name__)


def ders_sozluk(ders):
    return {
        "id": ders.id,
        "ogrenci_id": ders.ogrenci_id,
        "ders_adi": ders.ders_adi,
        "aciklama": ders.aciklama,
    }


def hedef_sozluk(hedef):
    return {
        "id": hedef.id,
        "ders_id": hedef.ders_id,
        "baslik": hedef.baslik,
        "hedef_saat": hedef.hedef_saat,
        "tamamlandi_mi": hedef.tamamlandi_mi,
    }


def konu_sozluk(konu):
    return {
        "id": konu.id,
        "ders_id": konu.ders_id,
        "konu_adi": konu.konu_adi,
        "tamamlandi_mi": konu.tamamlandi_mi,
        "notlar": konu.notlar,
        "zorluk": konu.zorluk,
    }


@dersler_bp.post("")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Ders olustur",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ogrenci_id": {"type": "integer"},
                        "ders_adi": {"type": "string"},
                        "aciklama": {"type": "string"},
                    },
                    "required": ["ogrenci_id", "ders_adi"],
                }
            }
        },
    },
    "responses": {"201": {"description": "Ders olustu"}, "400": {"description": "Dogrulama hatasi"}},
})
def ders_ekle():
    veri = request.get_json(silent=True) or {}
    ogrenci_id = veri.get("ogrenci_id")
    ders_adi = veri.get("ders_adi")
    aciklama = veri.get("aciklama")

    if ogrenci_id is None or not ders_adi:
        return {"hata": "ogrenci_id ve ders_adi gerekli"}, 400

    ogrenci = Ogrenci.query.get(ogrenci_id)
    if not ogrenci:
        return {"hata": "ogrenci bulunamadi"}, 400

    ders = Ders(ogrenci_id=ogrenci_id, ders_adi=ders_adi, aciklama=aciklama)
    db.session.add(ders)
    db.session.commit()

    return ders_sozluk(ders), 201


@dersler_bp.get("")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Dersleri listele",
    "responses": {"200": {"description": "Ders listesi"}},
})
def dersleri_listele():
    dersler = Ders.query.all()
    return [ders_sozluk(ders) for ders in dersler]


@dersler_bp.get("/<int:ders_id>")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Ders getir",
    "responses": {"200": {"description": "Ders detayi"}, "404": {"description": "Bulunamadi"}},
})
def ders_getir(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404
    return ders_sozluk(ders)


@dersler_bp.put("/<int:ders_id>")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Ders guncelle",
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "ogrenci_id": {"type": "integer"},
                        "ders_adi": {"type": "string"},
                        "aciklama": {"type": "string"},
                    },
                }
            }
        },
    },
    "responses": {"200": {"description": "Ders guncellendi"}, "404": {"description": "Bulunamadi"}},
})
def ders_guncelle(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404

    veri = request.get_json(silent=True) or {}
    if "ogrenci_id" in veri:
        ogrenci = Ogrenci.query.get(veri["ogrenci_id"])
        if not ogrenci:
            return {"hata": "ogrenci bulunamadi"}, 400
        ders.ogrenci_id = veri["ogrenci_id"]
    if "ders_adi" in veri:
        ders.ders_adi = veri["ders_adi"]
    if "aciklama" in veri:
        ders.aciklama = veri["aciklama"]

    db.session.commit()
    return ders_sozluk(ders)


@dersler_bp.delete("/<int:ders_id>")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Ders sil",
    "responses": {"200": {"description": "Ders silindi"}, "404": {"description": "Bulunamadi"}},
})
def ders_sil(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404

    db.session.delete(ders)
    db.session.commit()
    return {"durum": "silindi"}


@dersler_bp.get("/<int:ders_id>/hedefler")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Dersin hedefleri",
    "responses": {"200": {"description": "Hedef listesi"}, "404": {"description": "Bulunamadi"}},
})
def ders_hedefleri(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404

    hedefler = Hedef.query.filter_by(ders_id=ders_id).all()
    return [hedef_sozluk(hedef) for hedef in hedefler]


@dersler_bp.get("/<int:ders_id>/konular")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Dersin konulari",
    "responses": {"200": {"description": "Konu listesi"}, "404": {"description": "Bulunamadi"}},
})
def ders_konulari(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404

    konular = Konu.query.filter_by(ders_id=ders_id).all()
    return [konu_sozluk(konu) for konu in konular]


@dersler_bp.get("/<int:ders_id>/ilerleme")
@swag_from({
    "tags": ["Dersler"],
    "summary": "Ders ilerleme yuzdesi",
    "responses": {"200": {"description": "Ilerleme bilgisi"}, "404": {"description": "Bulunamadi"}},
})
def ders_ilerleme(ders_id):
    ders = Ders.query.get(ders_id)
    if not ders:
        return {"hata": "ders bulunamadi"}, 404

    toplam = Konu.query.filter_by(ders_id=ders_id).count()
    tamamlanan = Konu.query.filter_by(ders_id=ders_id, tamamlandi_mi=True).count()
    yuzde = 0 if toplam == 0 else round((tamamlanan / toplam) * 100)
    return {"ders_id": ders_id, "toplam_konu": toplam, "tamamlanan": tamamlanan, "yuzde": yuzde}
