# Ders Yoldasi

Bu repo, "Ders Yoldasi" ogrenci asistani projesinin full-stack (Flask API + Vite React UI) halidir.
Ek olarak MCP tabanli "Kitap Oneri Servisi" mikroservisi bulunur.

## Ekranlar
- Giris/Kayit ekrani: Kullanici adi ve sifre ile giris yapilir veya yeni hesap olusturulur.
- Dersler ekrani: Kullaniciya ait dersler listelenir, yeni ders eklenebilir.
- Ders detay ekrani: Secilen dersin konulari (to-do list) gorunur, konu eklenir, tik ile tamamlanir, not ve zorluk seviyesi ayarlanir, ilerleme yuzdesi anlik guncellenir.
- Kitap onerileri ekrani: Bir konu girilerek OpenLibrary uzerinden ilk 5 kitap listelenir.

## Odev Gereksinimleri ve Karsilanan Ozellikler
- CRUD + Swagger: Ogrenci, Ders, Konu (Konular) icin CRUD endpointleri vardir.
- Swagger: /apidocs uzerinden tum endpointler test edilebilir.
- Dockerfile ve docker-compose mevcuttur.
- Tek komutla uygulama ve PostgreSQL ayaga kalkar.
- Full-stack: React UI + Flask API iki servis olarak calisir.
- JWT/Bearer: /kimlik/giris ve /kimlik/kayit ile token alinir, /kimlik/korumali endpointi JWT gerektirir.
- MCP mikroservis: Kitap Oneri Servisi (FastMCP) eklendi.
- Entegrasyon: Flask API /api/kitaplar ile MCP servisine baglanir, UI /kitaplar sayfasindan erisilir.

## Teknolojiler
- Backend: Flask + SQLAlchemy + Flasgger
- Veritabani: PostgreSQL
- Frontend: React (Vite)
- Kimlik Dogrulama: JWT (flask-jwt-extended)
- MCP Mikroservis: FastMCP

## Projeyi Calistirma
1. Klasore girin:
   - cd Ders_Yoldasi
2. Servisleri baslatin:
   - docker compose up --build
3. UI:
   - http://localhost:5173
4. Swagger:
   - http://localhost:5000/apidocs
5. API saglik kontrolu:
   - http://localhost:5000/saglik
6. MCP servis (harici erisim):
   - http://localhost:8080/sse

## API Ozet
- Kimlik:
  - POST /kimlik/kayit
  - POST /kimlik/giris
  - GET /kimlik/korumali (JWT gerekli)
- Ogrenciler:
  - GET/POST /api/ogrenciler
  - GET/PUT/DELETE /api/ogrenciler/{id}
  - GET /api/ogrenciler/{id}/dersler
- Dersler:
  - GET/POST /api/dersler
  - GET/PUT/DELETE /api/dersler/{id}
  - GET /api/dersler/{id}/konular
  - GET /api/dersler/{id}/ilerleme
- Konular:
  - GET/POST /api/konular
  - GET/PUT/DELETE /api/konular/{id}
  - PATCH /api/konular/{id}/toggle
- Kitap onerileri:
  - GET /api/kitaplar?konu=python

## Veritabani
PostgreSQL kullanilir. Varsayilan ayarlar docker-compose icinde tanimlidir.

Tablolar:
- ogrenciler: id, ad_soyad, email
- kullanicilar: id, kullanici_adi, sifre_hash, ogrenci_id
- dersler: id, ogrenci_id, ders_adi, aciklama
- konular: id, ders_id, konu_adi, tamamlandi_mi, notlar, zorluk

Not: Yeni tablolar (konular gibi) create_all ile otomatik olusur.
