import React, { useState } from "react";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [statusMessage, setStatusMessage] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallingProtected, setIsCallingProtected] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setStatusMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) {
        setError("Gecersiz kullanici adi veya sifre.");
        return;
      }

      if (!res.ok) {
        setError("Giris islemi basarisiz oldu. Tekrar deneyin.");
        return;
      }

      const data = await res.json();
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        setStatusMessage("Giris basarili (JWT olusturuldu)");
        if (onLoginSuccess) onLoginSuccess(data);
      } else {
        setError("Token alinamadi.");
      }
    } catch (err) {
      setError("Sunucuya ulasilamadi. Lutfen tekrar deneyin.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProtectedCall = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Once token alin.");
      return;
    }

    setIsCallingProtected(true);
    setError(null);
    setStatusMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        alert("Token gecersiz veya suresi doldu.");
        console.error("401 Unauthorized");
        return;
      }

      if (!res.ok) {
        alert("Protected endpoint cagrisini yaparken hata olustu.");
        console.error("Protected endpoint error:", res.statusText);
        return;
      }

      const data = await res.json();
          console.log("Protected endpoint yaniti:", data);
          setStatusMessage("Protected endpoint cagrildi (detaylar console'da).");
    } catch (err) {
      alert("Sunucuya ulasilamadi.");
      console.error(err);
    } finally {
      setIsCallingProtected(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f7f8ff 0%, #e8f7f2 100%)",
      padding: "20px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "rgba(255, 255, 255, 0.96)",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(0,0,0,0.04)",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    title: {
      margin: 0,
      fontSize: "24px",
      color: "#1f2a44",
      textAlign: "center",
      letterSpacing: "-0.01em",
    },
    subtitle: {
      margin: 0,
      fontSize: "14px",
      color: "#5c6370",
      textAlign: "center",
    },
    group: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "14px", color: "#334155", fontWeight: 600 },
    input: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1px solid #dbe1ea",
      background: "#f9fbfd",
      fontSize: "15px",
      color: "#1f2a44",
      outline: "none",
      transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
    },
    primaryButton: {
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #88c0d0, #a5d8d3)",
      color: "#0f172a",
      fontWeight: 700,
      fontSize: "15px",
      cursor: isLoading ? "not-allowed" : "pointer",
      opacity: isLoading ? 0.7 : 1,
      transition: "transform 0.1s, box-shadow 0.2s",
    },
    secondaryButton: {
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid #dbe1ea",
      background: "#f4f7fb",
      color: "#1f2a44",
      fontWeight: 600,
      fontSize: "14px",
      cursor: isCallingProtected ? "not-allowed" : "pointer",
      opacity: isCallingProtected ? 0.7 : 1,
      transition: "background 0.2s, transform 0.1s",
    },
    error: {
      padding: "12px",
      borderRadius: "10px",
      background: "#ffecec",
      color: "#b42318",
      border: "1px solid #f5c2c7",
      fontSize: "14px",
    },
    success: {
      padding: "12px",
      borderRadius: "10px",
      background: "#e6fffa",
      color: "#0f766e",
      border: "1px solid #b6f3e4",
      fontSize: "14px",
    },
    actions: { display: "flex", flexDirection: "column", gap: "10px" },
    tokenBox: {
      padding: "12px",
      borderRadius: "10px",
      background: "#f1f5f9",
      color: "#0f172a",
      border: "1px dashed #cbd5e1",
      fontSize: "13px",
      wordBreak: "break-all",
    },
    tokenInfo: {
      margin: 0,
      fontSize: "13px",
      color: "#5c6370",
      fontWeight: 600,
    },
    tokenNote: {
      margin: "4px 0 0 0",
      fontSize: "12px",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div>
          <h2 style={styles.title}>JWT Demo Girisi</h2>
          <p style={styles.subtitle}>Giris yap, JWT olussun; sonrasinda korumali endpointi dene</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {statusMessage && <div style={styles.success}>{statusMessage}</div>}

        <div style={styles.group}>
          <label htmlFor="username" style={styles.label}>Kullanici Adi</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="admin"
            required
          />
        </div>

        <div style={styles.group}>
          <label htmlFor="password" style={styles.label}>Sifre</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="1234"
            required
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={isLoading} style={styles.primaryButton}>
            {isLoading ? "Gonderiliyor..." : "Giris Yap"}
          </button>
          <button type="button" disabled={isCallingProtected} style={styles.secondaryButton} onClick={handleProtectedCall}>
            {isCallingProtected ? "Cagiriliyor..." : "Korumali Endpoint'e Eris"}
          </button>
        </div>

        {token && (
          <div>
            <p style={styles.tokenInfo}>JWT Token (Demo amacli gosterim)</p>
            <div style={styles.tokenBox}>{token}</div>
            <p style={styles.tokenNote}>Gercek uygulamalarda token bu sekilde gosterilmez; sadece ders/demodur.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
