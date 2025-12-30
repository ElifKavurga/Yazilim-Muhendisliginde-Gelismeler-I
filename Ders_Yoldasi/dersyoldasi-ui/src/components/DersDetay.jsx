import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

function DersDetay({ ders, geriDon }) {
  const [konular, setKonular] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [konuAdi, setKonuAdi] = useState('');
  const [konuNotu, setKonuNotu] = useState('');
  const [zorluk, setZorluk] = useState('1');
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlemeNotu, setDuzenlemeNotu] = useState('');

  const tamamlanan = konular.filter((konu) => konu.tamamlandi_mi).length;
  const toplam = konular.length;
  const ilerleme = toplam === 0 ? 0 : Math.round((tamamlanan / toplam) * 100);

  useEffect(() => {
    const konulariGetir = async () => {
      setYukleniyor(true);
      setHata(null);
      try {
        const yanit = await fetch(`${API_URL}/api/dersler/${ders.id}/konular`);
        if (!yanit.ok) {
          throw new Error('konular alinamadi');
        }
        const veri = await yanit.json();
        setKonular(veri);
      } catch (err) {
        console.error(err);
        setHata('Konular yuklenemedi.');
      } finally {
        setYukleniyor(false);
      }
    };

    konulariGetir();
  }, [ders.id]);

  const konuEkleTikla = async (e) => {
    e.preventDefault();
    if (!konuAdi.trim()) return;

    try {
      const yanit = await fetch(`${API_URL}/api/konular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ders_id: ders.id,
          konu_adi: konuAdi,
          notlar: konuNotu,
          zorluk: Number(zorluk),
        }),
      });

      if (!yanit.ok) {
        throw new Error('konu eklenemedi');
      }

      const yeniKonu = await yanit.json();
      setKonular((onceki) => [...onceki, yeniKonu]);
      setKonuAdi('');
      setKonuNotu('');
      setZorluk('1');
      setFormAcik(false);
    } catch (err) {
      console.error(err);
      setHata('Konu eklenemedi.');
    }
  };

  const konuDurumDegistir = async (konuId) => {
    try {
      const yanit = await fetch(`${API_URL}/api/konular/${konuId}/toggle`, { method: 'PATCH' });
      if (!yanit.ok) {
        throw new Error('toggle basarisiz');
      }
      const guncel = await yanit.json();
      setKonular((onceki) => onceki.map((konu) => (konu.id === konuId ? guncel : konu)));
    } catch (err) {
      console.error(err);
      setHata('Konu durumu guncellenemedi.');
    }
  };

  const konuNotKaydet = async (konuId) => {
    try {
      const yanit = await fetch(`${API_URL}/api/konular/${konuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notlar: duzenlemeNotu }),
      });
      if (!yanit.ok) {
        throw new Error('not guncelleme basarisiz');
      }
      const guncel = await yanit.json();
      setKonular((onceki) => onceki.map((konu) => (konu.id === konuId ? guncel : konu)));
      setDuzenlenenId(null);
      setDuzenlemeNotu('');
    } catch (err) {
      console.error(err);
      setHata('Not guncellenemedi.');
    }
  };

  const konuZorlukDegistir = async (konuId, yeniZorluk) => {
    try {
      const yanit = await fetch(`${API_URL}/api/konular/${konuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zorluk: yeniZorluk }),
      });
      if (!yanit.ok) {
        throw new Error('zorluk guncelleme basarisiz');
      }
      const guncel = await yanit.json();
      setKonular((onceki) => onceki.map((konu) => (konu.id === konuId ? guncel : konu)));
    } catch (err) {
      console.error(err);
      setHata('Zorluk guncellenemedi.');
    }
  };

  const notDuzenleBaslat = (konu) => {
    setDuzenlenenId(konu.id);
    setDuzenlemeNotu(konu.notlar || '');
  };

  const stiller = {
    kapsayici: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    ust: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    geriButon: {
      padding: '8px 14px',
      borderRadius: '8px',
      border: '1px solid #dbe1ea',
      background: 'white',
      cursor: 'pointer',
      fontWeight: 600,
    },
    baslik: {
      margin: 0,
      fontSize: '28px',
      color: '#1f2a44',
    },
    altBaslik: {
      marginTop: '6px',
      color: '#6c757d',
      fontSize: '14px',
    },
    hata: {
      marginTop: '10px',
      color: '#b42318',
      fontSize: '13px',
    },
    ilerlemeKutu: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
      marginBottom: '24px',
    },
    ilerlemeBar: {
      height: '10px',
      borderRadius: '999px',
      background: '#eef2f7',
      overflow: 'hidden',
      marginTop: '10px',
    },
    ilerlemeDolgu: {
      height: '100%',
      width: `${ilerleme}%`,
      background: 'linear-gradient(90deg, #88c0d0, #a5d8d3)',
      transition: 'width 0.3s ease',
    },
    listeKutu: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
    },
    konuSatir: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr auto',
      gap: '12px',
      alignItems: 'start',
      padding: '12px 0',
      borderBottom: '1px solid #f1f5f9',
    },
    konuBaslik: {
      margin: 0,
      fontSize: '16px',
      color: '#1f2a44',
      fontWeight: 600,
    },
    konuNot: {
      marginTop: '4px',
      fontSize: '13px',
      color: '#6b7280',
    },
    rozet: {
      fontSize: '12px',
      color: '#475569',
      background: '#f1f5f9',
      padding: '4px 8px',
      borderRadius: '999px',
    },
    aksiyon: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      fontSize: '12px',
      padding: 0,
    },
    konuBos: {
      textAlign: 'center',
      color: '#6c757d',
      padding: '24px 0',
    },
    formButon: {
      padding: '10px 16px',
      borderRadius: '10px',
      border: 'none',
      background: '#28a745',
      color: 'white',
      fontWeight: 600,
      cursor: 'pointer',
    },
    formGirdi: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ced4da',
      marginBottom: '10px',
    },
    formSelect: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ced4da',
      marginBottom: '10px',
    },
  };

  return (
    <div style={stiller.kapsayici}>
      <div style={stiller.ust}>
        <button onClick={geriDon} style={stiller.geriButon}>Geri Don</button>
        <div />
      </div>

      <h1 style={stiller.baslik}>{ders.ders_adi}</h1>
      <div style={stiller.altBaslik}>%{ilerleme} tamamlandi • {toplam} konu</div>
      {hata && <div style={stiller.hata}>{hata}</div>}

      <div style={stiller.ilerlemeKutu}>
        <div>Ilerleme Durumu</div>
        <div style={stiller.ilerlemeBar}>
          <div style={stiller.ilerlemeDolgu} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Konular</h2>
        <button onClick={() => setFormAcik((acik) => !acik)} style={stiller.formButon}>
          Konu Ekle
        </button>
      </div>

      {formAcik && (
        <form onSubmit={konuEkleTikla} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Konu adi"
            value={konuAdi}
            onChange={(e) => setKonuAdi(e.target.value)}
            style={stiller.formGirdi}
            required
          />
          <textarea
            placeholder="Notlar (opsiyonel)"
            value={konuNotu}
            onChange={(e) => setKonuNotu(e.target.value)}
            rows={3}
            style={stiller.formGirdi}
          />
          <select
            value={zorluk}
            onChange={(e) => setZorluk(e.target.value)}
            style={stiller.formSelect}
          >
            <option value="1">Zorluk: 1 (Cok kolay)</option>
            <option value="2">Zorluk: 2</option>
            <option value="3">Zorluk: 3</option>
            <option value="4">Zorluk: 4</option>
            <option value="5">Zorluk: 5 (Cok zor)</option>
          </select>
          <button type="submit" style={stiller.formButon}>Kaydet</button>
        </form>
      )}

      <div style={stiller.listeKutu}>
        {yukleniyor ? (
          <div style={stiller.konuBos}>Konular yukleniyor...</div>
        ) : konular.length === 0 ? (
          <div style={stiller.konuBos}>Henuz konu eklenmedi.</div>
        ) : (
          konular.map((konu) => (
            <div key={konu.id} style={stiller.konuSatir}>
              <input
                type="checkbox"
                checked={konu.tamamlandi_mi}
                onChange={() => konuDurumDegistir(konu.id)}
              />
              <div>
                <h4 style={stiller.konuBaslik}>{konu.konu_adi}</h4>
                <div style={stiller.konuNot}>{konu.notlar || 'Not eklenmedi.'}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                  <span style={stiller.rozet}>Zorluk: {'*'.repeat(konu.zorluk || 1)}</span>
                  <select
                    value={String(konu.zorluk || 1)}
                    onChange={(e) => konuZorlukDegistir(konu.id, Number(e.target.value))}
                    style={{ fontSize: '12px', padding: '4px 6px' }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                {duzenlenenId === konu.id && (
                  <div style={{ marginTop: '8px' }}>
                    <textarea
                      rows={3}
                      value={duzenlemeNotu}
                      onChange={(e) => setDuzenlemeNotu(e.target.value)}
                      style={stiller.formGirdi}
                    />
                    <button
                      type="button"
                      style={{ ...stiller.formButon, background: '#2563eb' }}
                      onClick={() => konuNotKaydet(konu.id)}
                    >
                      Notu Kaydet
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                style={stiller.aksiyon}
                onClick={() => notDuzenleBaslat(konu)}
              >
                Notlari duzenle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DersDetay;
