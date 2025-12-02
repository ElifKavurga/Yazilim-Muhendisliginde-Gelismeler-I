import React, { useState } from "react";

function LoginForm({ onLoginSuccess }) {
  // --- STATE YÖNETİMİ ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Butonun üzerine gelindiğinde rengi değiştirmek için basit state
  const [isHover, setIsHover] = useState(false);

  // --- MANTIK KISMI (Logic) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data); // Başarılı giriş
      } else {
        setError("Hatalı kullanıcı bilgileri! Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- STİL OBJELERİ (CSS yerine geçen JS objeleri) ---
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f6f8",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    formCard: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "380px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    title: {
      margin: "0 0 5px 0",
      color: "#1a1a1a",
      textAlign: "center",
      fontSize: "24px",
    },
    subtitle: {
      margin: "0 0 15px 0",
      color: "#666",
      textAlign: "center",
      fontSize: "14px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#444",
    },
    input: {
      padding: "12px 15px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      fontSize: "16px",
      outline: "none",
      transition: "border 0.3s",
      width: "100%",
      boxSizing: "border-box", // Padding'in genişliği bozmasını engeller
    },
    button: {
      padding: "14px",
      backgroundColor: isHover ? "#0056b3" : "#007bff", // Hover durumu
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: isLoading ? "not-allowed" : "pointer",
      opacity: isLoading ? 0.7 : 1,
      transition: "background-color 0.3s",
      marginTop: "10px",
    },
    errorMessage: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
      padding: "10px",
      borderRadius: "4px",
      fontSize: "14px",
      textAlign: "center",
      border: "1px solid #ffcdd2",
    },
  };

  // --- GÖRÜNÜM (JSX) ---
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div>
          <h2 style={styles.title}>Giriş Yap</h2>
          <p style={styles.subtitle}>Hesabınıza erişmek için bilgilerinizi girin</p>
        </div>

        {/* Hata varsa göster */}
        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Şifre</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={styles.button}
          onMouseEnter={() => setIsHover(true)} // Hover efekti için
          onMouseLeave={() => setIsHover(false)}
        >
          {isLoading ? "Yükleniyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;