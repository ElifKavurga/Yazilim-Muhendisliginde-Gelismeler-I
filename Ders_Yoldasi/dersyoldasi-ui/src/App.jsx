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

  // Stiller objesini sildik çünkü artık tasarım componentlerin içinde.

  return (
    <Router>
      {/* Arka plan rengini sildik, componentler kendi arka planını yönetecek */}
      <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
        {oturum ? (
          <Routes>
            <Route path="/" element={<KontrolPaneli oturum={oturum} cikisYap={cikisYap} />} />
            <Route path="/kitaplar" element={<KitapOnerileri />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          // Yazıları buradan kaldırdık, GirisFormu'nun içine taşıdık
          <GirisFormu onGirisBasarili={girisBasarili} />
        )}
      </div>
    </Router>
  );
}

export default Uygulama;