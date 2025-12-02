import React, { useState } from 'react';

function CourseCard({ course }) {
  // Kartın üzerine gelindiğinde (Hover) efekt vermek için state
  const [isHover, setIsHover] = useState(false);

  // --- STİL OBJELERİ ---
  const styles = {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px', // Daha yumuşak köşeler
      padding: '24px',
      // Hover durumunda gölgeyi büyüt ve kartı yukarı kaldır
      boxShadow: isHover 
        ? '0 12px 24px rgba(0, 0, 0, 0.12)' 
        : '0 4px 6px rgba(0, 0, 0, 0.04)',
      transform: isHover ? 'translateY(-5px)' : 'none',
      transition: 'all 0.3s ease', // Animasyon geçişi
      border: '1px solid #edf2f7',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%', // Grid içinde kartların boyunu eşitler
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    iconBox: {
      width: '40px',
      height: '40px',
      backgroundColor: '#e3f2fd', // Açık mavi arka plan
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      lineHeight: '1.4',
    },
    description: {
      color: '#718096',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '20px',
      flexGrow: 1, // İçeriği yukarı iter, footer'ı aşağıya sabitler
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #f7fafc',
      paddingTop: '15px',
    },
    badge: {
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: '#f0fff4', // Açık yeşil
      color: '#38a169', // Koyu yeşil yazı
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    }
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Üst Kısım: İkon ve Başlık */}
      <div style={styles.header}>
        <div style={styles.iconBox}>📚</div>
        <h4 style={styles.title}>{course.name}</h4>
      </div>

      {/* Açıklama */}
      <p style={styles.description}>
        {course.description || 'Bu ders için henüz bir açıklama girilmemiş.'}
      </p>

      {/* Alt Kısım: İstatistikler (Mock Data korundu) */}
      <div style={styles.footer}>
        <span style={styles.badge}>
          ⚡ 0 Hedef
        </span>
        <span style={{ fontSize: '12px', color: '#cbd5e0' }}>Detaylar →</span>
      </div>
    </div>
  );
}

export default CourseCard;