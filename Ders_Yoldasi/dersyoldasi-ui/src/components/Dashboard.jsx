import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';

const API_URL = 'http://localhost:8000'; 

function Dashboard({ session, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCreateCourse = async () => {
    const newCourseName = prompt("Yeni dersin adını girin:");
    if (!newCourseName) return;

    try {
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCourseName, description: 'Yeni oluşturulan ders' }),
        });
        
        if (response.ok) {
            const newCourse = await response.json();
            setCourses([...courses, newCourse]);
        }
    } catch(error) {
        alert("Ders eklenirken hata oluştu.");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h1>Merhaba, {session.full_name}! 👋</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCreateCourse} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            + Yeni Ders Ekle
          </button>
          <button onClick={onLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
            Çıkış Yap
          </button>
        </div>
      </header>
      
      <section style={{ marginTop: '20px' }}>
        <h2>📝 Ders Programım ({courses.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' }}>
          {courses.length === 0 ? (
            <p>Henüz dersin yok. Hemen bir ders ekle!</p>
          ) : (
            courses.map(course => <CourseCard key={course.id} course={course} />)
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;