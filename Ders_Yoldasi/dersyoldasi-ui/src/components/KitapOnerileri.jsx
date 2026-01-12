import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function KitapOnerileri() {
  const [sorgu, setSorgu] = useState('');
  const [kitaplar, setKitaplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();

  const kitapAra = async (e) => {
    e.preventDefault();
    if (!sorgu.trim()) return;

    setYukleniyor(true);
    setHata('');
    setKitaplar([]); 

    try {
      // DÜZELTME: Senin backend endpoint yapına uygun URL
      // /api/kitaplar?konu=...
      const yanit = await fetch(`${API_URL}/api/kitaplar?konu=${encodeURIComponent(sorgu)}`);
      
      if (yanit.ok) {
        const veri = await yanit.json();
        // Backend direkt liste döndürüyor, kontrol edip set ediyoruz
        setKitaplar(Array.isArray(veri) ? veri : []);
      } else {
        throw new Error('Kitaplar alınamadı, lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Kitap arama hatası:', error);
      setHata('Sunucuya bağlanılamadı veya kitap bulunamadı.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="books-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        .books-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          font-family: 'Poppins', sans-serif;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .top-bar {
            width: 100%;
            max-width: 900px;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 20px;
        }

        .btn-home {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 15px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.4);
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-home:hover { background: rgba(255,255,255,0.4); }

        /* Arama Kutusu */
        .search-container {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 600px;
            text-align: center;
            margin-bottom: 40px;
        }

        .search-title { margin: 0 0 20px; color: #333; }

        .search-form {
            display: flex;
            gap: 10px;
        }

        .search-input {
            flex: 1;
            padding: 12px;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 16px;
            outline: none;
            transition: border 0.3s;
        }
        .search-input:focus { border-color: #007bff; }

        .btn-search {
            padding: 12px 25px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn-search:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,123,255,0.3); }

        /* Hata Mesajı */
        .error-msg {
            color: #dc3545;
            background: #ffecec;
            padding: 10px;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 14px;
        }

        /* Sonuç Grid */
        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            width: 100%;
            max-width: 1000px;
        }

        .book-card {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s;
            display: flex;
            flex-direction: column;
            /* İçeriği dikeyde hizalamak için */
        }
        .book-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

        /* Kitap Kapağı Alanı */
        .book-cover-area {
            height: 180px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f8f9fa;
            border-radius: 10px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .book-cover-img {
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
        }
        .book-icon-fallback {
            font-size: 50px;
            color: #ddd;
        }

        .book-info {
            text-align: center;
        }
        .book-title { font-size: 16px; font-weight: 600; color: #333; margin: 0 0 5px; line-height: 1.4; }
        .book-author { font-size: 14px; color: #666; margin: 0 0 10px; }
        .book-date { font-size: 12px; color: #999; background: #eee; display: inline-block; padding: 2px 8px; border-radius: 10px; }

      `}</style>

      <div className="top-bar">
        <button onClick={() => navigate('/')} className="btn-home">← Ana Sayfaya Dön</button>
      </div>

      <div className="search-container">
        <h2 className="search-title">Kitap Ara & Keşfet 🔍</h2>
        <form onSubmit={kitapAra} className="search-form">
          <input 
            type="text" 
            placeholder="Kitap adı, yazar veya konu..." 
            value={sorgu}
            onChange={(e) => setSorgu(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            {yukleniyor ? '...' : 'Ara'}
          </button>
        </form>
        {hata && <div className="error-msg">{hata}</div>}
      </div>

      <div className="results-grid">
        {kitaplar.map((kitap, index) => {
            // Yazar bazen liste (array) bazen string gelebilir, kontrol edelim
            const yazar = Array.isArray(kitap.author_name) 
                ? kitap.author_name.slice(0, 2).join(', ') + (kitap.author_name.length > 2 ? '...' : '')
                : kitap.author_name || 'Bilinmeyen Yazar';

            // Kapak resmi URL'si (OpenLibrary Cover API)
            const kapakUrl = kitap.cover_i 
                ? `https://covers.openlibrary.org/b/id/${kitap.cover_i}-M.jpg` 
                : null;

            return (
                <div key={index} className="book-card">
                    <div className="book-cover-area">
                        {kapakUrl ? (
                            <img src={kapakUrl} alt={kitap.title} className="book-cover-img" />
                        ) : (
                            <div className="book-icon-fallback">📖</div>
                        )}
                    </div>
                    
                    <div className="book-info">
                        <h3 className="book-title">{kitap.title}</h3>
                        <p className="book-author">{yazar}</p>
                        <div className="book-date">
                            {kitap.first_publish_year || 'Tarih Yok'}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {!yukleniyor && kitaplar.length === 0 && sorgu && !hata && (
          <p style={{color:'white', marginTop:'20px', opacity: 0.8}}>Sonuç bulunamadı.</p>
      )}

    </div>
  );
}

export default KitapOnerileri;