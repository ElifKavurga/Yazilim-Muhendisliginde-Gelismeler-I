import asyncio
import json

from flask import Blueprint, request
from fastmcp import Client


kitaplar_bp = Blueprint("kitaplar", __name__)


def _calistir_async(coro):
    return asyncio.run(coro)


def _icerigi_jsona_donustur(icerik):
    if icerik is None:
        return None
    metin = getattr(icerik, "text", None)
    if not isinstance(metin, str):
        return None
    metin = metin.strip()
    if not metin:
        return None
    try:
        return json.loads(metin)
    except json.JSONDecodeError:
        return metin


@kitaplar_bp.get("")
def kitaplari_getir():
    konu = request.args.get("konu", "").strip()
    if not konu:
        return {"hata": "konu parametresi gerekli"}, 400

    async def _kitaplari_cek():
        async with Client("http://kitap-servisi:8000/sse") as client:
            return await client.call_tool("kitap_ara", {"konu": konu})

    try:
        sonuc = _calistir_async(_kitaplari_cek())
    except Exception as exc:
        return {"hata": "kitap servisine baglanilamadi", "detay": str(exc)}, 502

    if hasattr(sonuc, "data") and sonuc.data is not None:
        return sonuc.data
    if hasattr(sonuc, "structured_content") and sonuc.structured_content is not None:
        return sonuc.structured_content
    if hasattr(sonuc, "content") and sonuc.content is not None:
        icerik_listesi = []
        for parca in sonuc.content:
            donusen = _icerigi_jsona_donustur(parca)
            if donusen is not None:
                icerik_listesi.append(donusen)
        if len(icerik_listesi) == 1 and isinstance(icerik_listesi[0], (list, dict)):
            return icerik_listesi[0]
        if icerik_listesi:
            return icerik_listesi
    return {"hata": "beklenmeyen MCP cevabi"}, 502
