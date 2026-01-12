import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function GirisFormu({ onGirisBasarili }) {
  const [girisKullaniciAdi, setGirisKullaniciAdi] = useState("");
  const [girisSifre, setGirisSifre] = useState("");
  const [kayitKullaniciAdi, setKayitKullaniciAdi] = useState("");
  const [kayitSifre, setKayitSifre] = useState("");
  const [adSoyad, setAdSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [durumMesaji, setDurumMesaji] = useState("");
  const [jeton, setJeton] = useState("");
  const [hata, setHata] = useState(null);
  const [girisYukleniyor, setGirisYukleniyor] = useState(false);
  const [kayitYukleniyor, setKayitYukleniyor] = useState(false);
  const [korumaliYukleniyor, setKorumaliYukleniyor] = useState(false);
  const [kayitModu, setKayitModu] = useState(false);

  // --- API FONKSİYONLARI (Aynı Kalıyor) ---
  const girisYap = async (e) => {
    e.preventDefault();
    setHata(null); setDurumMesaji(""); setGirisYukleniyor(true);
    try {
      const yanit = await fetch(`${API_URL}/kimlik/giris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kullanici_adi: girisKullaniciAdi, sifre: girisSifre }),
      });
      if (yanit.status === 401) { setHata("Kullanici adi veya sifre hatali."); return; }
      if (!yanit.ok) { setHata("Giris basarisiz. Tekrar deneyin."); return; }
      const veri = await yanit.json();
      if (veri?.erisim_jetonu) {
        localStorage.setItem("erisim_jetonu", veri.erisim_jetonu);
        setJeton(veri.erisim_jetonu);
        setDurumMesaji("Giris basarili.");
        if (onGirisBasarili) onGirisBasarili({ erisim_jetonu: veri.erisim_jetonu, kullanici_adi: veri.kullanici_adi, ogrenci: veri.ogrenci });
      } else { setHata("Jeton alinmadi."); }
    } catch (err) { setHata("Sunucuya ulasilamadi."); console.error(err); } finally { setGirisYukleniyor(false); }
  };

  const kayitOl = async (e) => {
    e.preventDefault();
    setHata(null); setDurumMesaji(""); setKayitYukleniyor(true);
    try {
      const yanit = await fetch(`${API_URL}/kimlik/kayit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kullanici_adi: kayitKullaniciAdi, sifre: kayitSifre, ad_soyad: adSoyad, email }),
      });
      if (!yanit.ok) { setHata("Kayit basarisiz. Bilgileri kontrol edin."); return; }
      const veri = await yanit.json();
      if (veri?.erisim_jetonu) {
        localStorage.setItem("erisim_jetonu", veri.erisim_jetonu);
        setJeton(veri.erisim_jetonu);
        setDurumMesaji("Kayit basarili.");
        if (onGirisBasarili) onGirisBasarili({ erisim_jetonu: veri.erisim_jetonu, kullanici_adi: veri.kullanici_adi, ogrenci: veri.ogrenci });
      } else { setHata("Jeton alinmadi."); }
    } catch (err) { setHata("Sunucuya ulasilamadi."); console.error(err); } finally { setKayitYukleniyor(false); }
  };

  const korumaliCagir = async () => {
    const sakliJeton = localStorage.getItem("erisim_jetonu");
    if (!sakliJeton) { setHata("Korumali endpoint icin giris yapin."); return; }
    setKorumaliYukleniyor(true); setHata(null); setDurumMesaji("");
    try {
      const yanit = await fetch(`${API_URL}/kimlik/korumali`, { headers: { Authorization: `Bearer ${sakliJeton}` } });
      if (yanit.status === 401) { setHata("Jeton gecersiz veya suresi doldu."); return; }
      if (!yanit.ok) { setHata("Korumali endpoint cagrisinda hata olustu."); return; }
      const veri = await yanit.json();
      console.log("Korumali yanit:", veri);
      setDurumMesaji("Korumali endpoint cagrildi (console'da detay var).");
    } catch (err) { setHata("Sunucuya ulasilamadi."); console.error(err); } finally { setKorumaliYukleniyor(false); }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        .login-wrapper {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          display: flex;
          flex-direction: column; /* İçeriği dikey hizalamak için */
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
        }

        /* Ana Marka Başlığı */
        .brand-header {
            text-align: center;
            color: white;
            margin-bottom: 30px; /* Kart ile başlık arası boşluk */
            z-index: 2;
            text-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .brand-title {
            font-size: 3rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: -1px;
        }
        .brand-subtitle {
            font-size: 1.2rem;
            font-weight: 300;
            margin-top: 5px;
            opacity: 0.9;
        }

        /* Yüzen Objeler */
        .floating-item {
          position: absolute; opacity: 0.2; color: white;
          font-size: 4rem; animation: float 6s ease-in-out infinite;
          user-select: none; z-index: 0;
        }
        .item-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .item-2 { bottom: 15%; right: 10%; animation-delay: 2s; }
        .item-3 { top: 20%; right: 20%; font-size: 2rem; animation-delay: 1s; }
        .item-4 { bottom: 20%; left: 20%; font-size: 6rem; opacity: 0.1; }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* Kart */
        .login-container {
          background: #ffffff;
          width: 400px;
          padding: 50px 30px 40px;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
          text-align: center;
          margin: 0 20px; /* Mobilde kenarlara yapışmasın */
        }
        /* Logo Badge */
        .logo-badge {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 36px;
          position: absolute; top: -40px; left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
          border: 5px solid #ffffff;
        }

        /* Form Stilleri */
        h2.form-title { margin-top: 25px; color: #333; font-weight: 600; font-size: 24px; }
        p.form-subtitle { font-size: 13px; color: #666; margin-bottom: 30px; }
        
        .input-group { margin-bottom: 20px; text-align: left; position: relative; }
        .input-group label { display: block; font-size: 13px; color: #666; margin-bottom: 5px; font-weight: 600; }
        .input-group input {
          width: 100%; padding: 10px 0; border: none; border-bottom: 2px solid #ddd;
          font-size: 16px; color: #333; outline: none; background: transparent; transition: 0.3s;
        }
        .input-group input:focus { border-bottom-color: #007bff; }
        .check-icon { position: absolute; right: 0; bottom: 10px; color: #2ecc71; font-size: 18px; opacity: 0; transition: 0.3s; }
        .input-group input:valid ~ .check-icon { opacity: 1; }

        .btn-primary {
          width: 100%; padding: 15px; background: #007bff; color: white; border: none;
          border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;
          margin-top: 10px; transition: 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,123,255,0.4); }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; }

        .btn-secondary {
            width: 100%; padding: 10px; margin-top: 10px; background: #f4f7fb; color: #1f2a44;
            border: 1px solid #dbe1ea; border-radius: 8px; font-size: 13px; font-weight: 600;
            cursor: pointer; transition: 0.2s;
        }
        .btn-secondary:hover { background: #eef2f7; }

        .footer-link { margin-top: 20px; font-size: 14px; color: #888; }
        .footer-link span { color: #007bff; font-weight: 600; cursor: pointer; }

        .msg-box { padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 15px; }
        .msg-error { background: #ffecec; color: #b42318; border: 1px solid #f5c2c7; }
        .msg-success { background: #e6fffa; color: #0f766e; border: 1px solid #b6f3e4; }
        .token-box { margin-top: 15px; padding: 8px; background: #f1f5f9; border: 1px dashed #cbd5e1; font-size: 11px; word-break: break-all; color: #555; text-align: left; }
        
        .form-fade-in { animation: fadeUI 0.5s ease; }
        @keyframes fadeUI { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Arka Plan Süsleri */}
      <div className="floating-item item-1">📚</div>
      <div className="floating-item item-2">✏️</div>
      <div className="floating-item item-3">✅</div>
      <div className="floating-item item-4">⏰</div>

      {/* YENİ EKLENEN KISIM: Marka Başlığı (Kartın Üstünde) */}
      <div className="brand-header">
        <h1 className="brand-title">Ders Yoldaşı</h1>
        <p className="brand-subtitle">Planla, takip et ve geliş.</p>
      </div>

      <div className="login-container">
        {/* Logo (Kitap İkonu) */}
        <div className="logo-badge">
          📚
        </div>

        {hata && <div className="msg-box msg-error">{hata}</div>}
        {durumMesaji && <div className="msg-box msg-success">{durumMesaji}</div>}

        {kayitModu ? (
          <form onSubmit={kayitOl} className="form-fade-in">
            <h2 className="form-title">Kayıt Ol</h2>
            <p className="form-subtitle">Yeni bir öğrenci hesabı oluşturun.</p>

            <div className="input-group">
              <label htmlFor="kayitKullaniciAdi">Kullanıcı Adı</label>
              <input id="kayitKullaniciAdi" type="text" placeholder="ali123" value={kayitKullaniciAdi} onChange={(e) => setKayitKullaniciAdi(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>
            <div className="input-group">
              <label htmlFor="adSoyad">Ad Soyad</label>
              <input id="adSoyad" type="text" placeholder="Ali Yılmaz" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>
            <div className="input-group">
              <label htmlFor="email">E-posta</label>
              <input id="email" type="email" placeholder="ali@ornek.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>
            <div className="input-group">
              <label htmlFor="kayitSifre">Şifre</label>
              <input id="kayitSifre" type="password" placeholder="••••••••" value={kayitSifre} onChange={(e) => setKayitSifre(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>

            <button type="submit" disabled={kayitYukleniyor} className="btn-primary">
              {kayitYukleniyor ? "Kaydediliyor..." : "Kayıt Ol ve Giriş Yap"}
            </button>
            <div className="footer-link">
              Zaten hesabınız var mı? <span onClick={() => { setHata(null); setKayitModu(false); }}>Giriş Yap</span>
            </div>
          </form>
        ) : (
          <form onSubmit={girisYap} className="form-fade-in">
            <h2 className="form-title">Giriş Yap</h2>
            <p className="form-subtitle">Devam etmek için hesabınıza giriş yapın.</p>

            <div className="input-group">
              <label htmlFor="kullaniciAdi">Kullanıcı Adı</label>
              <input id="kullaniciAdi" type="text" placeholder="Kullanıcı adınız" value={girisKullaniciAdi} onChange={(e) => setGirisKullaniciAdi(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>
            <div className="input-group">
              <label htmlFor="sifre">Şifre</label>
              <input id="sifre" type="password" placeholder="••••••••" value={girisSifre} onChange={(e) => setGirisSifre(e.target.value)} required />
              <i className="check-icon">✓</i>
            </div>

            <button type="submit" disabled={girisYukleniyor} className="btn-primary">
              {girisYukleniyor ? "Gönderiliyor..." : "Giriş Yap"}
            </button>
            <button type="button" onClick={korumaliCagir} disabled={korumaliYukleniyor} className="btn-secondary">
              {korumaliYukleniyor ? "Çağrılıyor..." : "Korumalı Endpoint'i Çağır"}
            </button>

            {jeton && <div className="token-box"><strong>JWT Jetonu:</strong><br/>{jeton.substring(0, 50)}...</div>}

            <div className="footer-link">
              Hesabınız yok mu? <span onClick={() => { setHata(null); setKayitModu(true); }}>Kayıt Ol</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default GirisFormu;