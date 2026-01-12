import React, { useState } from 'react';

function DersKarti({ ders, dersSec }) {
  const [hover, setHover] = useState(false);

  // Rastgele pastel renkler için basit bir fonksiyon (İkon arkaplanı için)
  const getRandomColor = (id) => {
    const colors = ['#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa'];
    return colors[id % colors.length] || '#e3f2fd';
  };
  
  const iconBg = getRandomColor(ders.id || 0);

  const styles = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)', // Hafif transparan beyaz
      borderRadius: '20px',
      padding: '25px',
      boxShadow: hover 
        ? '0 15px 30px rgba(0, 0, 0, 0.15)' // Hoverda daha derin gölge
        : '0 5px 15px rgba(0, 0, 0, 0.05)',
      transform: hover ? 'translateY(-8px)' : 'none', // Hoverda yukarı kalkma
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: 'none',
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '15px',
    },
    iconBox: {
      width: '50px',
      height: '50px',
      backgroundColor: iconBg,
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#444',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3436',
    },
    desc: {
      fontSize: '14px',
      color: '#636e72',
      lineHeight: '1.5',
      marginBottom: '20px',
      flexGrow: 1,
    },
    footer: {
      borderTop: '1px solid #f1f2f6',
      paddingTop: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badge: {
      fontSize: '12px',
      padding: '5px 10px',
      backgroundColor: '#f1f2f6',
      color: '#636e72',
      borderRadius: '10px',
      fontWeight: '600',
    },
    arrow: {
      color: '#007bff',
      fontWeight: 'bold',
      fontSize: '18px',
    }
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => dersSec && dersSec(ders)}
    >
      <div style={styles.header}>
        {/* Dersin Baş Harfi */}
        <div style={styles.iconBox}>
          {ders.ders_adi ? ders.ders_adi.charAt(0).toUpperCase() : 'D'}
        </div>
        <h3 style={styles.title}>{ders.ders_adi}</h3>
      </div>

      <p style={styles.desc}>
        {ders.aciklama || 'Bu ders için henüz bir açıklama girilmemiş.'}
      </p>

      <div style={styles.footer}>
        <span style={styles.badge}>Henüz Hedef Yok</span>
        <span style={styles.arrow}>→</span>
      </div>
    </div>
  );
}

export default DersKarti;