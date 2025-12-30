import React, { useState } from 'react';

function DersKarti({ ders, dersSec }) {
  const [uzerinde, setUzerinde] = useState(false);

  const stiller = {
    kart: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: uzerinde
        ? '0 12px 24px rgba(0, 0, 0, 0.12)'
        : '0 4px 6px rgba(0, 0, 0, 0.04)',
      transform: uzerinde ? 'translateY(-5px)' : 'none',
      transition: 'all 0.3s ease',
      border: '1px solid #edf2f7',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
    ust: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    ikonKutu: {
      width: '40px',
      height: '40px',
      backgroundColor: '#e3f2fd',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
    },
    baslik: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      lineHeight: '1.4',
    },
    aciklama: {
      color: '#718096',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '20px',
      flexGrow: 1,
    },
    alt: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #f7fafc',
      paddingTop: '15px',
    },
    rozet: {
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: '#f0fff4',
      color: '#38a169',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    },
  };

  return (
    <div
      style={stiller.kart}
      onMouseEnter={() => setUzerinde(true)}
      onMouseLeave={() => setUzerinde(false)}
      onClick={() => dersSec && dersSec(ders)}
    >
      <div style={stiller.ust}>
        <div style={stiller.ikonKutu}>D</div>
        <h4 style={stiller.baslik}>{ders.ders_adi}</h4>
      </div>

      <p style={stiller.aciklama}>
        {ders.aciklama || 'Bu ders icin aciklama yok.'}
      </p>

      <div style={stiller.alt}>
        <span style={stiller.rozet}>0 Hedef</span>
        <span style={{ fontSize: '12px', color: '#cbd5e0' }}>Detaylar -&gt;</span>
      </div>
    </div>
  );
}

export default DersKarti;
