import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DersDetay from './DersDetay';
import DersKarti from './CourseCard';

const API_URL = 'http://localhost:5000';

function KontrolPaneli({ oturum, cikisYap }) {
  const [dersler, setDersler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniDersAdi, setYeniDersAdi] = useState('');
  const [yeniDersAciklama, setYeniDersAciklama] = useState('');
  const [dersOlusturuluyor, setDersOlusturuluyor] = useState(false);
  const [seciliDers, setSeciliDers] = useState(null);

  const navigate = useNavigate();
  const ogrenciId = oturum?.ogrenci?.id;

  useEffect(() => {
    if (!ogrenciId) {
      setYukleniyor(false);
      return;
    }

    const dersleriGetir = async () => {
      try {
        const yanit = await fetch(`${API_URL}/api/ogrenciler/${ogrenciId}/dersler`);
        if (yanit.ok) {
          const veri = await yanit.json();
          setDersler(veri);
        }
      } catch (error) {
        console.error('Dersler alinamadi:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    dersleriGetir();
  }, [ogrenciId]);

  const dersKaydet = async (e) => {
    e.preventDefault();
    if (!yeniDersAdi.trim() || !ogrenciId) return;

    setDersOlusturuluyor(true);

    try {
      const yanit = await fetch(`${API_URL}/api/dersler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ogrenci_id: ogrenciId,
          ders_adi: yeniDersAdi,
          aciklama: yeniDersAciklama,
        }),
      });

      if (yanit.ok) {
        const yeniDers = await yanit.json();
        setDersler((onceki) => [...onceki, yeniDers]);
        setModalAcik(false);
        setYeniDersAdi('');
        setYeniDersAciklama('');
      }
    } catch (error) {
      alert('Ders olusturulamadi.');
    } finally {
      setDersOlusturuluyor(false);
    }
  };

  if (yukleniyor) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: 'white', 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h2>Dersler Yükleniyor... ⏳</h2>
      </div>
    );
  }

  if (seciliDers) {
    return <DersDetay ders={seciliDers} geriDon={() => setSeciliDers(null)} />;
  }

  return (
    <div className="dashboard-wrapper">
      {/* --- STİLLER (Gömülü CSS) --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        .dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          font-family: 'Poppins', sans-serif;
          padding: 40px;
          position: relative;
          overflow-x: hidden; /* Yatay scrollu engelle */
        }

        /* Yüzen Objeler (Fixed: Sayfa kayınca sabit kalsın) */
        .floating-item {
          position: fixed; 
          opacity: 0.15;
          color: white;
          font-size: 4rem;
          animation: float 6s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        .item-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .item-2 { bottom: 15%; right: 5%; animation-delay: 2s; }
        .item-3 { top: 15%; right: 15%; font-size: 2.5rem; animation-delay: 1s; }
        .item-4 { bottom: 10%; left: 10%; font-size: 5rem; opacity: 0.1; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* Navbar / Header Kartı */
        .header-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        }

        .header-title h1 {
          margin: 0;
          color: #333;
          font-weight: 600;
          font-size: 24px;
        }
        .header-title span {
          color: #666;
          font-size: 14px;
        }

        /* Butonlar */
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .btn-success { background: #2ecc71; color: white; } /* Yeşil */
        .btn-success:hover { box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4); }

        .btn-primary { background: #007bff; color: white; } /* Mavi */
        .btn-primary:hover { box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4); }

        .btn-danger { background: #ff6b6b; color: white; } /* Kırmızı */
        .btn-danger:hover { box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); }

        .btn-group { display: flex; gap: 15px; }

        /* İçerik Bölümü */
        .content-section {
          position: relative;
          z-index: 2;
        }
        .section-title {
          color: white;
          font-size: 22px;
          margin-bottom: 20px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .grid-container {
          display: grid;
          grid-templateColumns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        /* Boş Durum */
        .empty-state {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 50px;
          text-align: center;
          color: #666;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        /* Modal (Ders Ekleme) */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          maxWidth: 450px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease;
        }

        .modal-title { margin-top: 0; color: #333; margin-bottom: 10px; }
        .modal-desc { color: #888; font-size: 14px; margin-bottom: 30px; }

        /* Login Sayfasındaki gibi Input Stili */
        .clean-input {
          width: 100%;
          padding: 10px 0;
          border: none;
          border-bottom: 2px solid #eee;
          background: transparent;
          font-size: 16px;
          color: #333;
          margin-bottom: 25px;
          outline: none;
          transition: border-color 0.3s;
        }
        .clean-input:focus {
          border-bottom-color: #007bff;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 10px;
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      `}</style>

      {/* Arka Plan Süslemeleri */}
      <div className="floating-item item-1">📚</div>
      <div className="floating-item item-2">✏️</div>
      <div className="floating-item item-3">✅</div>
      <div className="floating-item item-4">⏰</div>

      {/* HEADER */}
      <header className="header-card">
        <div className="header-title">
          <h1>Merhaba, {oturum?.ogrenci?.ad_soyad || oturum?.kullanici_adi}! 👋</h1>
          <span>Bugün hedeflerini tamamlamaya hazır mısın?</span>
        </div>
        <div className="btn-group">
          <button onClick={() => setModalAcik(true)} className="btn btn-success">
            + Yeni Ders
          </button>
          <button onClick={() => navigate('/kitaplar')} className="btn btn-primary">
            📚 Kitap Önerileri
          </button>
          <button onClick={cikisYap} className="btn btn-danger">
            Çıkış
          </button>
        </div>
      </header>

      {/* İÇERİK */}
      <section className="content-section">
        <h2 className="section-title">
          Derslerim ({dersler.length})
        </h2>

        <div className="grid-container">
          {dersler.length === 0 ? (
            <div className="empty-state">
              <h3>Henüz ders eklenmemiş 😔</h3>
              <p>Yukarıdaki yeşil butona tıklayarak ilk dersini ekle ve çalışmaya başla!</p>
            </div>
          ) : (
            dersler.map((ders) => (
              <DersKarti key={ders.id} ders={ders} dersSec={setSeciliDers} />
            ))
          )}
        </div>
      </section>

      {/* MODAL (POP-UP) */}
      {modalAcik && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Ders Ekle</h2>
            <p className="modal-desc">Yeni bir ders oluşturarak hedeflerini belirle.</p>

            <form onSubmit={dersKaydet}>
              <input
                type="text"
                autoFocus
                placeholder="Ders Adı (Örn: Matematik)"
                value={yeniDersAdi}
                onChange={(e) => setYeniDersAdi(e.target.value)}
                className="clean-input"
              />
              <input
                type="text"
                placeholder="Açıklama (Opsiyonel)"
                value={yeniDersAciklama}
                onChange={(e) => setYeniDersAciklama(e.target.value)}
                className="clean-input"
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalAcik(false)}
                  className="btn"
                  style={{ background: '#f1f3f5', color: '#333' }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={dersOlusturuluyor}
                  className="btn btn-success"
                  style={{ opacity: dersOlusturuluyor ? 0.7 : 1 }}
                >
                  {dersOlusturuluyor ? 'Oluşturuluyor...' : 'Oluştur 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KontrolPaneli;