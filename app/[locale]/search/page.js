"use client";

import { useState } from 'react';
import { useTranslation } from '../../../components/TranslationProvider';

export default function SearchDirectory() {
  const dict = useTranslation();
  const [filterRole, setFilterRole] = useState('all');
  
  // Dummy Data for the MVP
  const users = [
    { id: 1, name: "Yuki", role: "illustrator", style: "Anime", desc: dict.search.desc1 },
    { id: 2, name: "Shiro", role: "writer", style: "Fantasy", desc: dict.search.desc2 },
    { id: 3, name: "Jin", role: "illustrator", style: "Dark", desc: dict.search.desc3 },
    { id: 4, name: "Rin", role: "writer", style: "Romance", desc: dict.search.desc4 }
  ];

  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{dict.search.title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{dict.search.subtitle}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          className={`btn ${filterRole === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterRole('all')}
        >{dict.search.all}</button>
        <button 
          className={`btn ${filterRole === 'writer' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterRole('writer')}
        >{dict.search.writers}</button>
        <button 
          className={`btn ${filterRole === 'illustrator' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterRole('illustrator')}
        >{dict.search.illustrators}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {filteredUsers.map(u => (
          <div key={u.id} style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ height: '160px', background: u.role === 'writer' ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
              {u.role === 'writer' ? '📝' : '🎨'}
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{u.name}</h3>
                <span style={{ 
                  background: 'var(--bg-color)', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '99px',
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}>
                  {u.style}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '3rem' }}>
                {u.desc}
              </p>
              <button className="btn btn-outline" style={{ width: '100%' }}>{dict.search.viewProfile}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
