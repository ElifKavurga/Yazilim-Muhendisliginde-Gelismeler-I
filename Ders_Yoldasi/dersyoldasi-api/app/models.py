from .extensions import db


class Ogrenci(db.Model):
    __tablename__ = "ogrenciler"

    id = db.Column(db.Integer, primary_key=True)
    ad_soyad = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

    dersler = db.relationship("Ders", backref="ogrenci", cascade="all, delete-orphan")
    kullanici = db.relationship("Kullanici", backref="ogrenci", uselist=False, cascade="all, delete-orphan")


class Kullanici(db.Model):
    __tablename__ = "kullanicilar"

    id = db.Column(db.Integer, primary_key=True)
    kullanici_adi = db.Column(db.String(80), unique=True, nullable=False)
    sifre_hash = db.Column(db.String(255), nullable=False)
    ogrenci_id = db.Column(db.Integer, db.ForeignKey("ogrenciler.id"), nullable=False, unique=True)


class Ders(db.Model):
    __tablename__ = "dersler"

    id = db.Column(db.Integer, primary_key=True)
    ogrenci_id = db.Column(db.Integer, db.ForeignKey("ogrenciler.id"), nullable=False)
    ders_adi = db.Column(db.String(150), nullable=False)
    aciklama = db.Column(db.Text, nullable=True)

    hedefler = db.relationship("Hedef", backref="ders", cascade="all, delete-orphan")
    konular = db.relationship("Konu", backref="ders", cascade="all, delete-orphan")


class Hedef(db.Model):
    __tablename__ = "hedefler"

    id = db.Column(db.Integer, primary_key=True)
    ders_id = db.Column(db.Integer, db.ForeignKey("dersler.id"), nullable=False)
    baslik = db.Column(db.String(200), nullable=False)
    hedef_saat = db.Column(db.Integer, nullable=False)
    tamamlandi_mi = db.Column(db.Boolean, nullable=False, default=False)


class Konu(db.Model):
    __tablename__ = "konular"

    id = db.Column(db.Integer, primary_key=True)
    ders_id = db.Column(db.Integer, db.ForeignKey("dersler.id"), nullable=False)
    konu_adi = db.Column(db.String(200), nullable=False)
    tamamlandi_mi = db.Column(db.Boolean, nullable=False, default=False)
    notlar = db.Column(db.Text, nullable=True)
    zorluk = db.Column(db.Integer, nullable=False, default=1)
