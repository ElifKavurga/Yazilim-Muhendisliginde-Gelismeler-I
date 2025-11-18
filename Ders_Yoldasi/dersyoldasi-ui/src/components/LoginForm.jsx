import { useState } from 'react';

const API_URL = 'http://localhost:8000'; 

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('ogrenci@ornek.com'); 
  const [password, setPassword] = useState('123456');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Giriş yapılıyor...');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Giriş Başarılı!');
        onLoginSuccess(data); 
      } else {
        setMessage(`Hata: ${data.detail || 'Bilinmeyen Giriş Hatası'}`);
      }

    } catch (error) {
      setMessage(`Bağlantı Hatası: API çalışmıyor olabilir. ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Ders Yoldaşı'na Giriş</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
          Giriş Yap
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.startsWith('Hata') ? 'red' : 'green' }}>{message}</p>}
      <p style={{marginTop:'15px', fontSize:'0.8em'}}>Demo: ogrenci@ornek.com / 123456</p>
    </div>
  );
}

export default LoginForm;