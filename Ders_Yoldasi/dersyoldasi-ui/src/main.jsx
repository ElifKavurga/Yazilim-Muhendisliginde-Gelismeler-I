import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// --- GLOBAL STİL AYARLARI ---
// Harici bir CSS dosyası kullanmadığımız için, temel sayfa ayarlarını
// (font, arka plan, sıfırlama) buradan enjekte ediyoruz.
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f8f9fa; /* Tüm uygulamanın zemin rengi */
      color: #333;
    }
    
    /* Tüm kutu modellerini sınırlarına dahil et (Padding taşmasını engeller) */
    * {
      box-sizing: border-box;
    }

    /* Scrollbar'ı (kaydırma çubuğu) daha şık yapalım */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
      background: #ccc; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #aaa; 
    }
  `;
  document.head.appendChild(style);
};

// Stilleri uygula
injectGlobalStyles();

// --- UYGULAMAYI BAŞLAT ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);