import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GirisFormu from './components/LoginForm';
import KontrolPaneli from './components/Dashboard';
import KitapOnerileri from './components/KitapOnerileri';

function Uygulama() {
  const [oturum, setOturum] = useState(null);

  const girisBasarili = (veri) => {
    setOturum(veri);
  };

  const cikisYap = () => {
    localStorage.removeItem('erisim_jetonu');
    setOturum(null);
  };

  const stiller = {
    anaKapsayici: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    girisDuzeni: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
    },
    markaBaslik: {
      fontSize: '3rem',
      color: '#2c3e50',
      marginBottom: '10px',
      marginTop: '0',
      fontWeight: 'bold',
      letterSpacing: '-1px',
      textAlign: 'center',
    },
    markaAltBaslik: {
      fontSize: '1.2rem',
      color: '#6c757d',
      marginTop: '0',
      marginBottom: '40px',
      textAlign: 'center',
    },
  };

  return (
    <Router>
      <div style={stiller.anaKapsayici}>
        {oturum ? (
          <Routes>
            <Route path="/" element={<KontrolPaneli oturum={oturum} cikisYap={cikisYap} />} />
            <Route path="/kitaplar" element={<KitapOnerileri />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <div style={stiller.girisDuzeni}>
            <div>
              <h1 style={stiller.markaBaslik}>Ders Yoldasi</h1>
              <p style={stiller.markaAltBaslik}>
                Planla, takip et ve gelis.
              </p>
            </div>

            <GirisFormu onGirisBasarili={girisBasarili} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default Uygulama;
