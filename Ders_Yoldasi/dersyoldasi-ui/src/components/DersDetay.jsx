import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

function DersDetay({ ders, geriDon }) {
  // --- STATE TANIMLARI ---
  const [konular, setKonular] = useState([]);
  const [hedefler, setHedefler] = useState([]); // Hedefler eklendi
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  // Konu Formu
  const [konuAdi, setKonuAdi] = useState('');
  const [konuNotu, setKonuNotu] = useState('');
  const [zorluk, setZorluk] = useState('1');
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlemeNotu, setDuzenlemeNotu] = useState('');

  // Hedef Formu
  const [yeniHedefBaslik, setYeniHedefBaslik] = useState('');
  const [yeniHedefSaat, setYeniHedefSaat] = useState('');

  // İlerleme Hesabı
  const tamamlanan = konular.filter((konu) => konu.tamamlandi_mi).length;
  const toplam = konular.length;
  const ilerleme = toplam === 0 ? 0 : Math.round((tamamlanan / toplam) * 100);

  // --- API VERİ ÇEKME ---
  useEffect(() => {
    veriGetir();
  }, [ders.id]);

  const veriGetir = async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      // Hem Konuları hem Hedefleri paralel çekiyoruz
      const [konuYanit, hedefYanit] = await Promise.all([
        fetch(`${API_URL}/api/dersler/${ders.id}/konular`),
        fetch(`${API_URL}/api/dersler/${ders.id}/hedefler`),
      ]);

      if (!konuYanit.ok || !hedefYanit.ok) {
        throw new Error('Veriler alınamadı.');
      }

      setKonular(await konuYanit.json());
      setHedefler(await hedefYanit.json());
    } catch (err) {
      console.error(err);
      setHata('Ders detayları yüklenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  // --- KONU İŞLEMLERİ ---
  const konuEkle = async (e) => {
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

      if (!yanit.ok) throw new Error('Konu eklenemedi');
      
      const yeniKonu = await yanit.json();
      setKonular((onceki) => [...onceki, yeniKonu]);
      setKonuAdi(''); setKonuNotu(''); setZorluk('1');
    } catch (err) { console.error(err); setHata('Konu eklenemedi.'); }
  };

  const konuSil = async (id) => {
    if (!window.confirm('Bu konuyu silmek istediğine emin misin?')) return;
    try {
      await fetch(`${API_URL}/api/konular/${id}`, { method: 'DELETE' });
      setKonular(konular.filter((k) => k.id !== id));
    } catch (error) { console.error(error); }
  };

  const konuGuncelle = async (id, veri) => {
    try {
        const yanit = await fetch(`${API_URL}/api/konular/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veri),
        });
        if(yanit.ok) {
            const guncel = await yanit.json();
            setKonular(prev => prev.map(k => k.id === id ? guncel : k));
        }
    } catch (e) { console.error(e); }
  };
  
  const toggleKonu = async (id) => {
      try {
          const yanit = await fetch(`${API_URL}/api/konular/${id}/toggle`, { method: 'PATCH' });
          if(yanit.ok) {
              const guncel = await yanit.json();
              setKonular(prev => prev.map(k => k.id === id ? guncel : k));
          }
      } catch (e) { console.error(e); }
  };

  // --- HEDEF İŞLEMLERİ (YENİ EKLENDİ) ---
  const hedefEkle = async (e) => {
    e.preventDefault();
    if (!yeniHedefBaslik.trim() || !yeniHedefSaat) return;

    try {
      const yanit = await fetch(`${API_URL}/api/hedefler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ders_id: ders.id,
          baslik: yeniHedefBaslik,
          hedef_saat: Number(yeniHedefSaat)
        }),
      });

      if (!yanit.ok) throw new Error('Hedef eklenemedi');
      
      const yeniHedef = await yanit.json();
      setHedefler((onceki) => [...onceki, yeniHedef]);
      setYeniHedefBaslik(''); setYeniHedefSaat('');
    } catch (err) { console.error(err); setHata('Hedef eklenemedi.'); }
  };

  const hedefSil = async (id) => {
    try {
      await fetch(`${API_URL}/api/hedefler/${id}`, { method: 'DELETE' });
      setHedefler(hedefler.filter((h) => h.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="detail-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        .detail-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          font-family: 'Poppins', sans-serif;
          padding: 40px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .main-card {
          background: #ffffff;
          width: 100%;
          max-width: 1000px;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }

        .btn-back {
          background: #f1f3f5; color: #333; border: none; padding: 10px 20px;
          border-radius: 10px; cursor: pointer; font-weight: 600;
        }
        .btn-back:hover { background: #e9ecef; }

        .progress-container { margin-bottom: 30px; }
        .progress-bar {
            height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin-top: 5px;
        }
        .progress-fill {
            height: 100%; background: #2ecc71; transition: width 0.3s ease;
        }

        .content-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
        }
        @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }

        .section-box {
            background: #f8f9fa; border-radius: 15px; padding: 20px;
        }
        .section-title { font-size: 18px; color: #007bff; margin-bottom: 15px; font-weight: 600; }

        /* Formlar */
        .add-form { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .clean-input {
            flex: 1; padding: 8px; border: none; border-bottom: 2px solid #ddd;
            background: transparent; outline: none; font-size: 14px;
        }
        .clean-input:focus { border-bottom-color: #007bff; }
        .btn-add {
            background: #007bff; color: white; border: none; width: 35px; height: 35px;
            border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;
        }

        /* Liste Öğeleri */
        .list-item {
            background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #eee;
        }
        .item-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .item-content { flex: 1; }
        .item-title { font-weight: 600; color: #333; margin-bottom: 5px; display: block; }
        .item-meta { font-size: 12px; color: #888; display: flex; gap: 10px; align-items: center; }
        
        .delete-btn { color: #ff6b6b; cursor: pointer; font-size: 18px; border: none; background: none; }
        
        .difficulty-badge {
            background: #e3f2fd; color: #0d47a1; padding: 2px 6px; border-radius: 4px; font-size: 11px;
        }
        
        .checkbox-custom { width: 18px; height: 18px; cursor: pointer; margin-top: 3px; }

      `}</style>

      <div className="main-card">
        {/* Üst Kısım */}
        <div className="header">
          <button onClick={geriDon} className="btn-back">← Geri</button>
          <div style={{textAlign:'center'}}>
            <h2 style={{margin:0}}>{ders.ders_adi}</h2>
            <p style={{margin:'5px 0 0', color:'#666', fontSize:'13px'}}>{ders.aciklama}</p>
          </div>
          <div style={{width:'80px'}}></div> {/* Hizalama için boşluk */}
        </div>

        {/* İlerleme Çubuğu */}
        <div className="progress-container">
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'#555'}}>
                <span>Genel İlerleme</span>
                <span>%{ilerleme}</span>
            </div>
            <div className="progress-bar">
                <div className="progress-fill" style={{width: `${ilerleme}%`}}></div>
            </div>
        </div>

        <div className="content-grid">
            {/* --- SOL KOLON: KONULAR --- */}
            <div className="section-box">
                <h3 className="section-title">📚 Konular</h3>
                
                <form onSubmit={konuEkle} className="add-form">
                    <input className="clean-input" placeholder="Konu adı..." value={konuAdi} onChange={e=>setKonuAdi(e.target.value)} required />
                    <select className="clean-input" style={{flex:'0 0 60px'}} value={zorluk} onChange={e=>setZorluk(e.target.value)}>
                        <option value="1">K1</option><option value="2">K2</option><option value="3">K3</option><option value="4">K4</option><option value="5">K5</option>
                    </select>
                    <button type="submit" className="btn-add">+</button>
                </form>

                {konular.map(konu => (
                    <div key={konu.id} className="list-item">
                        <div className="item-row">
                            <input type="checkbox" className="checkbox-custom" checked={konu.tamamlandi_mi} onChange={() => toggleKonu(konu.id)} />
                            <div className="item-content">
                                <span className="item-title" style={{textDecoration: konu.tamamlandi_mi ? 'line-through' : 'none', color: konu.tamamlandi_mi ? '#999' : '#333'}}>
                                    {konu.konu_adi}
                                </span>
                                <div className="item-meta">
                                    <span className="difficulty-badge">Zorluk: {konu.zorluk}</span>
                                    {konu.notlar && <span>📝 Not var</span>}
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => konuSil(konu.id)}>🗑️</button>
                        </div>
                        {/* Not Düzenleme Alanı (Basitleştirilmiş) */}
                        <div style={{marginTop:'10px', fontSize:'12px'}}>
                            <textarea 
                                style={{width:'100%', border:'1px solid #eee', borderRadius:'5px', padding:'5px', fontSize:'12px'}}
                                placeholder="Not ekle..."
                                defaultValue={konu.notlar || ''}
                                onBlur={(e) => konuGuncelle(konu.id, {notlar: e.target.value})}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SAĞ KOLON: HEDEFLER --- */}
            <div className="section-box">
                <h3 className="section-title" style={{color:'#2ecc71'}}>🎯 Hedefler</h3>
                
                <form onSubmit={hedefEkle} className="add-form">
                    <input className="clean-input" placeholder="Hedef (Örn: 50 soru çöz)" value={yeniHedefBaslik} onChange={e=>setYeniHedefBaslik(e.target.value)} required />
                    <input className="clean-input" type="number" placeholder="Saat" style={{flex:'0 0 50px'}} value={yeniHedefSaat} onChange={e=>setYeniHedefSaat(e.target.value)} required />
                    <button type="submit" className="btn-add" style={{background:'#2ecc71'}}>+</button>
                </form>

                {hedefler.length === 0 && <p style={{color:'#999', fontSize:'13px', textAlign:'center'}}>Henüz hedef eklenmedi.</p>}

                {hedefler.map(hedef => (
                    <div key={hedef.id} className="list-item">
                        <div className="item-row">
                            <div className="item-content">
                                <span className="item-title">{hedef.baslik}</span>
                                <div className="item-meta">
                                    <span>⏱️ Hedef: {hedef.hedef_saat} Saat</span>
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => hedefSil(hedef.id)}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

export default DersDetay;