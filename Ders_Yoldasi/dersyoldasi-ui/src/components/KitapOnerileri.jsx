import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

function KitapOnerileri() {
  const [konu, setKonu] = useState('');
  const [kitaplar, setKitaplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const kitaplariGetir = async (e) => {
    e.preventDefault();
    const arama = konu.trim();
    if (!arama) return;

    setYukleniyor(true);
    setHata('');
    setKitaplar([]);

    try {
      const yanit = await fetch(`${API_URL}/api/kitaplar?konu=${encodeURIComponent(arama)}`);
      if (!yanit.ok) {
        throw new Error('Kitaplar alinamadi.');
      }
      const veri = await yanit.json();
      setKitaplar(Array.isArray(veri) ? veri : []);
    } catch (error) {
      setHata(error.message || 'Bir hata olustu.');
    } finally {
      setYukleniyor(false);
    }
  };

  const stiller = {
    kapsayici: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    baslik: {
      margin: '0 0 20px 0',
      color: '#2c3e50',
      fontSize: '24px',
    },
    aramaFormu: {
      display: 'flex',
      gap: '12px',
      marginBottom: '25px',
    },
    girdi: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ced4da',
      fontSize: '16px',
    },
    buton: {
      padding: '12px 22px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    kartIzgara: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '20px',
    },
    kart: {
      backgroundColor: 'white',
      padding: '18px',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    },
    kartBaslik: {
      margin: '0 0 8px 0',
      color: '#2c3e50',
      fontSize: '18px',
    },
    kartMetin: {
      margin: 0,
      color: '#6c757d',
      fontSize: '14px',
    },
    durum: {
      color: '#6c757d',
      marginTop: '10px',
    },
    hata: {
      color: '#dc3545',
      marginTop: '10px',
    },
  };

  return (
    <div style={stiller.kapsayici}>
      <h1 style={stiller.baslik}>Kitap Onerileri</h1>

      <form onSubmit={kitaplariGetir} style={stiller.aramaFormu}>
        <input
          type="text"
          placeholder="Ornek: python, veri bilimi, algoritma"
          value={konu}
          onChange={(e) => setKonu(e.target.value)}
          style={stiller.girdi}
        />
        <button type="submit" style={stiller.buton} disabled={yukleniyor}>
          {yukleniyor ? 'Araniyor...' : 'Ara'}
        </button>
      </form>

      {hata && <div style={stiller.hata}>{hata}</div>}
      {yukleniyor && <div style={stiller.durum}>Kitaplar getiriliyor...</div>}

      <div style={stiller.kartIzgara}>
        {kitaplar.map((kitap, index) => {
          const yazar = Array.isArray(kitap.author_name)
            ? kitap.author_name.join(', ')
            : kitap.author_name || 'Bilinmiyor';
          return (
            <div key={`${kitap.title}-${index}`} style={stiller.kart}>
              <h3 style={stiller.kartBaslik}>{kitap.title || 'Isimsiz kitap'}</h3>
              <p style={stiller.kartMetin}>Yazar: {yazar}</p>
              <p style={stiller.kartMetin}>
                Yil: {kitap.first_publish_year || 'Bilinmiyor'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KitapOnerileri;
