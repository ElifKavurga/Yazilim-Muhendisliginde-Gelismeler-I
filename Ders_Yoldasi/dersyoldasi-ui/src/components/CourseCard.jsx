import React from 'react';

function CourseCard({ course }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
      <h4>📚 {course.name}</h4>
      <p style={{ fontSize: '0.9em', color: '#555' }}>{course.description || 'Açıklama mevcut değil.'}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <span style={{ fontSize: '0.8em', color: '#007bff' }}>0 Hedef (Mock)</span>
      </div>
    </div>
  );
}

export default CourseCard;