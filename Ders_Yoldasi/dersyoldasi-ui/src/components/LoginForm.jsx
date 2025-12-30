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

  const girisYap = async (e) => {
    e.preventDefault();
    setHata(null);
    setDurumMesaji("");
    setGirisYukleniyor(true);

    try {
      const yanit = await fetch(`${API_URL}/kimlik/giris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kullanici_adi: girisKullaniciAdi, sifre: girisSifre }),
      });

      if (yanit.status === 401) {
        setHata("Kullanici adi veya sifre hatali.");
        return;
      }

      if (!yanit.ok) {
        setHata("Giris basarisiz. Tekrar deneyin.");
        return;
      }

      const veri = await yanit.json();
      if (veri?.erisim_jetonu) {
        localStorage.setItem("erisim_jetonu", veri.erisim_jetonu);
        setJeton(veri.erisim_jetonu);
        setDurumMesaji("Giris basarili.");
        if (onGirisBasarili) {
          onGirisBasarili({
            erisim_jetonu: veri.erisim_jetonu,
            kullanici_adi: veri.kullanici_adi,
            ogrenci: veri.ogrenci,
          });
        }
      } else {
        setHata("Jeton alinmadi.");
      }
    } catch (err) {
      setHata("Sunucuya ulasilamadi.");
      console.error(err);
    } finally {
      setGirisYukleniyor(false);
    }
  };

  const kayitOl = async (e) => {
    e.preventDefault();
    setHata(null);
    setDurumMesaji("");
    setKayitYukleniyor(true);

    try {
      const yanit = await fetch(`${API_URL}/kimlik/kayit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kullanici_adi: kayitKullaniciAdi,
          sifre: kayitSifre,
          ad_soyad: adSoyad,
          email,
        }),
      });

      if (!yanit.ok) {
        setHata("Kayit basarisiz. Bilgileri kontrol edin.");
        return;
      }

      const veri = await yanit.json();
      if (veri?.erisim_jetonu) {
        localStorage.setItem("erisim_jetonu", veri.erisim_jetonu);
        setJeton(veri.erisim_jetonu);
        setDurumMesaji("Kayit basarili.");
        if (onGirisBasarili) {
          onGirisBasarili({
            erisim_jetonu: veri.erisim_jetonu,
            kullanici_adi: veri.kullanici_adi,
            ogrenci: veri.ogrenci,
          });
        }
      } else {
        setHata("Jeton alinmadi.");
      }
    } catch (err) {
      setHata("Sunucuya ulasilamadi.");
      console.error(err);
    } finally {
      setKayitYukleniyor(false);
    }
  };

  const korumaliCagir = async () => {
    const sakliJeton = localStorage.getItem("erisim_jetonu");
    if (!sakliJeton) {
      setHata("Korumali endpoint icin giris yapin.");
      return;
    }

    setKorumaliYukleniyor(true);
    setHata(null);
    setDurumMesaji("");

    try {
      const yanit = await fetch(`${API_URL}/kimlik/korumali`, {
        headers: { Authorization: `Bearer ${sakliJeton}` },
      });

      if (yanit.status === 401) {
        setHata("Jeton gecersiz veya suresi doldu.");
        return;
      }

      if (!yanit.ok) {
        setHata("Korumali endpoint cagrisinda hata olustu.");
        return;
      }

      const veri = await yanit.json();
      console.log("Korumali yanit:", veri);
      setDurumMesaji("Korumali endpoint cagrildi (console'da detay var).");
    } catch (err) {
      setHata("Sunucuya ulasilamadi.");
      console.error(err);
    } finally {
      setKorumaliYukleniyor(false);
    }
  };

  const stiller = {
    kapsayici: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f7f8ff 0%, #e8f7f2 100%)",
      padding: "20px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    kart: {
      width: "100%",
      maxWidth: "480px",
      background: "rgba(255, 255, 255, 0.96)",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(0,0,0,0.04)",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    baslik: {
      margin: 0,
      fontSize: "24px",
      color: "#1f2a44",
      textAlign: "center",
      letterSpacing: "-0.01em",
    },
    altBaslik: {
      margin: 0,
      fontSize: "14px",
      color: "#5c6370",
      textAlign: "center",
    },
    grup: { display: "flex", flexDirection: "column", gap: "6px" },
    etiket: { fontSize: "14px", color: "#334155", fontWeight: 600 },
    girdi: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1px solid #dbe1ea",
      background: "#f9fbfd",
      fontSize: "15px",
      color: "#1f2a44",
      outline: "none",
      transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
    },
    birincilButon: {
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #88c0d0, #a5d8d3)",
      color: "#0f172a",
      fontWeight: 700,
      fontSize: "15px",
      cursor: girisYukleniyor || kayitYukleniyor ? "not-allowed" : "pointer",
      opacity: girisYukleniyor || kayitYukleniyor ? 0.7 : 1,
      transition: "transform 0.1s, box-shadow 0.2s",
    },
    ikincilButon: {
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid #dbe1ea",
      background: "#f4f7fb",
      color: "#1f2a44",
      fontWeight: 600,
      fontSize: "14px",
      cursor: korumaliYukleniyor ? "not-allowed" : "pointer",
      opacity: korumaliYukleniyor ? 0.7 : 1,
      transition: "background 0.2s, transform 0.1s",
    },
    hataKutusu: {
      padding: "12px",
      borderRadius: "10px",
      background: "#ffecec",
      color: "#b42318",
      border: "1px solid #f5c2c7",
      fontSize: "14px",
    },
    basariKutusu: {
      padding: "12px",
      borderRadius: "10px",
      background: "#e6fffa",
      color: "#0f766e",
      border: "1px solid #b6f3e4",
      fontSize: "14px",
    },
    aksiyonlar: { display: "flex", flexDirection: "column", gap: "10px" },
    jetonKutusu: {
      padding: "12px",
      borderRadius: "10px",
      background: "#f1f5f9",
      color: "#0f172a",
      border: "1px dashed #cbd5e1",
      fontSize: "13px",
      wordBreak: "break-all",
    },
    jetonBaslik: {
      margin: 0,
      fontSize: "13px",
      color: "#5c6370",
      fontWeight: 600,
    },
    jetonNotu: {
      margin: "4px 0 0 0",
      fontSize: "12px",
      color: "#6b7280",
    },
    ayirici: {
      height: "1px",
      background: "#eef2f7",
      margin: "4px 0",
    },
    altMetin: {
      marginTop: "12px",
      fontSize: "13px",
      color: "#5c6370",
      textAlign: "center",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={stiller.kapsayici}>
      <form onSubmit={kayitModu ? kayitOl : girisYap} style={stiller.kart}>
        <div>
          <h2 style={stiller.baslik}>{kayitModu ? "Kayit Ol" : "Giris"}</h2>
          <p style={stiller.altBaslik}>
            {kayitModu
              ? "Yeni bir kullanici ve ogrenci olusturun."
              : "Korumali endpoint'lere erismek icin giris yapin."}
          </p>
        </div>

        {hata && <div style={stiller.hataKutusu}>{hata}</div>}
        {durumMesaji && <div style={stiller.basariKutusu}>{durumMesaji}</div>}

        {kayitModu ? (
          <>
            <div style={stiller.grup}>
              <label htmlFor="kayitKullaniciAdi" style={stiller.etiket}>Kullanici adi</label>
              <input
                id="kayitKullaniciAdi"
                type="text"
                value={kayitKullaniciAdi}
                onChange={(e) => setKayitKullaniciAdi(e.target.value)}
                style={stiller.girdi}
                placeholder="kullaniciadi"
                required
              />
            </div>

            <div style={stiller.grup}>
              <label htmlFor="adSoyad" style={stiller.etiket}>Ad soyad</label>
              <input
                id="adSoyad"
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                style={stiller.girdi}
                placeholder="Ad Soyad"
                required
              />
            </div>

            <div style={stiller.grup}>
              <label htmlFor="email" style={stiller.etiket}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={stiller.girdi}
                placeholder="email@example.com"
                required
              />
            </div>

            <div style={stiller.grup}>
              <label htmlFor="kayitSifre" style={stiller.etiket}>Sifre</label>
              <input
                id="kayitSifre"
                type="password"
                value={kayitSifre}
                onChange={(e) => setKayitSifre(e.target.value)}
                style={stiller.girdi}
                placeholder="sifre"
                required
              />
            </div>

            <button type="submit" disabled={kayitYukleniyor} style={stiller.birincilButon}>
              {kayitYukleniyor ? "Kaydediliyor..." : "Kayit Ol ve Giris Yap"}
            </button>

            <div
              style={stiller.altMetin}
              onClick={() => {
                setHata(null);
                setDurumMesaji("");
                setKayitModu(false);
              }}
            >
              Zaten hesabiniz var mi? Giris yapin
            </div>
          </>
        ) : (
          <>
            <div style={stiller.grup}>
              <label htmlFor="kullaniciAdi" style={stiller.etiket}>Kullanici adi</label>
              <input
                id="kullaniciAdi"
                type="text"
                value={girisKullaniciAdi}
                onChange={(e) => setGirisKullaniciAdi(e.target.value)}
                style={stiller.girdi}
                placeholder="kullaniciadi"
                required
              />
            </div>

            <div style={stiller.grup}>
              <label htmlFor="sifre" style={stiller.etiket}>Sifre</label>
              <input
                id="sifre"
                type="password"
                value={girisSifre}
                onChange={(e) => setGirisSifre(e.target.value)}
                style={stiller.girdi}
                placeholder="sifre"
                required
              />
            </div>

            <div style={stiller.aksiyonlar}>
              <button type="submit" disabled={girisYukleniyor} style={stiller.birincilButon}>
                {girisYukleniyor ? "Gonderiliyor..." : "Giris Yap"}
              </button>
              <button
                type="button"
                disabled={korumaliYukleniyor}
                style={stiller.ikincilButon}
                onClick={korumaliCagir}
              >
                {korumaliYukleniyor ? "Cagriliyor..." : "Korumali Endpoint'i Cagir"}
              </button>
            </div>

            {jeton && (
              <div>
                <p style={stiller.jetonBaslik}>JWT Jetonu</p>
                <div style={stiller.jetonKutusu}>{jeton}</div>
                <p style={stiller.jetonNotu}>Bu goruntu demo amacli gosterilir.</p>
              </div>
            )}

            <div
              style={stiller.altMetin}
              onClick={() => {
                setHata(null);
                setDurumMesaji("");
                setKayitModu(true);
              }}
            >
              Hesabin yok mu? Kayit ol
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default GirisFormu;
