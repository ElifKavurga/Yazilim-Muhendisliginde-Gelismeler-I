import React, { useState, useEffect } from 'react';
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

  const stiller = {
    kapsayici: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    ustBilgi: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    baslik: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '24px',
    },
    butonGrubu: {
      display: 'flex',
      gap: '12px',
    },
    butonBasarili: {
      padding: '10px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    butonTehlike: {
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    izgara: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
    },
    bosDurum: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px dashed #dee2e6',
    },
    modalArkaPlan: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalIcerik: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
    girdi: {
      width: '100%',
      padding: '12px',
      margin: '12px 0',
      borderRadius: '6px',
      border: '1px solid #ced4da',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    modalAksiyonlar: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    },
  };

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>
        <h2>Dersler yukleniyor...</h2>
      </div>
    );
  }

  if (seciliDers) {
    return <DersDetay ders={seciliDers} geriDon={() => setSeciliDers(null)} />;
  }

  return (
    <div style={stiller.kapsayici}>
      <header style={stiller.ustBilgi}>
        <div>
          <h1 style={stiller.baslik}>Hos geldin, {oturum?.ogrenci?.ad_soyad || oturum?.kullanici_adi}!</h1>
          <span style={{ color: '#6c757d', fontSize: '14px' }}>
            Derslerini ve hedeflerini buradan takip et.
          </span>
        </div>
        <div style={stiller.butonGrubu}>
          <button onClick={() => setModalAcik(true)} style={stiller.butonBasarili}>
            + Yeni Ders
          </button>
          <button onClick={cikisYap} style={stiller.butonTehlike}>
            Cikis Yap
          </button>
        </div>
      </header>

      <section>
        <h2 style={{ color: '#495057', marginBottom: '20px' }}>
          Derslerim <span style={{ fontSize: '0.8em', color: '#aaa' }}>({dersler.length})</span>
        </h2>

        <div style={stiller.izgara}>
          {dersler.length === 0 ? (
            <div style={stiller.bosDurum}>
              <h3>Henuz ders yok</h3>
              <p>Yukaridaki yesil butonla ilk dersini olusturabilirsin.</p>
            </div>
          ) : (
            dersler.map((ders) => (
              <DersKarti key={ders.id} ders={ders} dersSec={setSeciliDers} />
            ))
          )}
        </div>
      </section>

      {modalAcik && (
        <div style={stiller.modalArkaPlan}>
          <div style={stiller.modalIcerik}>
            <h3 style={{ marginTop: 0 }}>Ders Olustur</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Ders adi ve aciklama girin.
            </p>

            <form onSubmit={dersKaydet}>
              <input
                type="text"
                autoFocus
                placeholder="Ders adi"
                value={yeniDersAdi}
                onChange={(e) => setYeniDersAdi(e.target.value)}
                style={stiller.girdi}
              />
              <input
                type="text"
                placeholder="Aciklama (opsiyonel)"
                value={yeniDersAciklama}
                onChange={(e) => setYeniDersAciklama(e.target.value)}
                style={stiller.girdi}
              />

              <div style={stiller.modalAksiyonlar}>
                <button
                  type="button"
                  onClick={() => setModalAcik(false)}
                  style={{ ...stiller.butonTehlike, backgroundColor: '#6c757d' }}
                >
                  Iptal
                </button>
                <button
                  type="submit"
                  disabled={dersOlusturuluyor}
                  style={{ ...stiller.butonBasarili, opacity: dersOlusturuluyor ? 0.7 : 1 }}
                >
                  {dersOlusturuluyor ? 'Olusturuluyor...' : 'Olustur'}
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
