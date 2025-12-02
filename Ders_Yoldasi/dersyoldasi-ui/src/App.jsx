import React, { useState } from 'react';
import LoginForm from './components/LoginForm'; // Dosya yollarını projene göre kontrol et
import Dashboard from './components/Dashboard';

function App() {
  const [session, setSession] = useState(null);

  const handleLoginSuccess = (data) => {
    setSession(data);
  };

  const handleLogout = () => {
    setSession(null);
  };

  // --- STİL OBJELERİ ---
  const styles = {
    // Ana kapsayıcı: Tüm ekranı kaplar ve arka plan rengini ayarlar
    mainContainer: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    // Sadece Login ekranı için ortalayıcı düzen
    loginLayout: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
    },
    // Marka Başlığı (Sadece Login ekranında görünür)
    brandTitle: {
      fontSize: '3rem',
      color: '#2c3e50',
      marginBottom: '10px',
      marginTop: '0',
      fontWeight: 'bold',
      letterSpacing: '-1px',
      textAlign: 'center',
    },
    brandSubtitle: {
      fontSize: '1.2rem',
      color: '#6c757d',
      marginTop: '0',
      marginBottom: '40px', // Form ile başlık arasındaki boşluk
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.mainContainer}>
      
      {session ? (
        /* DURUM 1: Giriş Yapıldı -> Direkt Dashboard'u göster */
        /* Dashboard kendi padding ve düzenine sahip olduğu için buraya ek stil gerekmez */
        <Dashboard session={session} onLogout={handleLogout} />
      ) : (
        /* DURUM 2: Giriş Yapılmadı -> Başlık ve Formu ortala */
        <div style={styles.loginLayout}>
          <div>
            <h1 style={styles.brandTitle}>🎓 Ders Yoldaşı</h1>
            <p style={styles.brandSubtitle}>
              Öğrenme yolculuğunuzu planlayın, takip edin ve başarın.
            </p>
          </div>
          
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )}

    </div>
  );
}

export default App;