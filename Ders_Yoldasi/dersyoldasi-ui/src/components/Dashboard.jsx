import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';

const API_URL = 'http://localhost:8000';

function Dashboard({ session, onLogout }) {
  // --- STATE YÖNETİMİ ---
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Sayfa yükleniyor mu?
  
  // Modal (Ders Ekleme Penceresi) için state'ler
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [isCreating, setIsCreating] = useState(false); // Ders ekleniyor mu?

  // --- API İŞLEMLERİ (MEVCUT MANTIK KORUNDU) ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Kurs çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Yeni ders ekleme fonksiyonu (Eski prompt yerine modal kullanıyor)
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    setIsCreating(true);

    try {
        // Python API bağlantısı aynen korundu
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCourseName, description: 'Yeni oluşturulan ders' }),
        });
        
        if (response.ok) {
            const newCourse = await response.json();
            setCourses([...courses, newCourse]); // Listeyi güncelle
            setIsModalOpen(false); // Modalı kapat
            setNewCourseName(""); // Inputu temizle
        }
    } catch(error) {
        alert("Ders eklenirken hata oluştu.");
    } finally {
        setIsCreating(false);
    }
  };

  // --- STİL OBJELERİ ---
  const styles = {
    container: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    title: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '24px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    btnSuccess: {
      padding: '10px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    btnDanger: {
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
    },
    emptyState: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '40px',
      color: '#6c757d',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px dashed #dee2e6',
    },
    // Modal Stilleri
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '15px 0',
      borderRadius: '6px',
      border: '1px solid #ced4da',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>
      <h2>Dersler Yükleniyor...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Üst Başlık */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Hoş Geldin, {session.full_name}! 👋</h1>
          <span style={{ color: '#6c757d', fontSize: '14px' }}>Öğrenim sürecini buradan takip et.</span>
        </div>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={styles.btnSuccess}
          >
            + Yeni Ders Ekle
          </button>
          <button onClick={onLogout} style={styles.btnDanger}>
            Çıkış Yap
          </button>
        </div>
      </header>
      
      {/* Ders Listesi */}
      <section>
        <h2 style={{ color: '#495057', marginBottom: '20px' }}>
            📝 Ders Programım <span style={{fontSize: '0.8em', color:'#aaa'}}>({courses.length})</span>
        </h2>
        
        <div style={styles.grid}>
          {courses.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>Henüz hiç dersin yok!</h3>
              <p>Yukarıdaki yeşil butona basarak ilk dersini oluşturabilirsin.</p>
            </div>
          ) : (
            courses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </div>
      </section>

      {/* MODAL (POPUP) - Yeni Ekleme */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginTop: 0 }}>Yeni Ders Oluştur</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Dersin adını girin (Örn: Veri Yapıları)</p>
            
            <form onSubmit={handleSaveCourse}>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Ders adı..." 
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  style={styles.input}
                />
                
                <div style={styles.modalActions}>
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        style={{...styles.btnDanger, backgroundColor: '#6c757d'}}
                    >
                        İptal
                    </button>
                    <button 
                        type="submit" 
                        disabled={isCreating}
                        style={{...styles.btnSuccess, opacity: isCreating ? 0.7 : 1}}
                    >
                        {isCreating ? 'Ekleniyor...' : 'Oluştur'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;