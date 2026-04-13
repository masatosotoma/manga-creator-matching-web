"use client";

import Link from 'next/link';

export default function GalleryDirectory() {

  const publishedWorks = [
    { id: '101', title: 'The Last Samurai Apprentice', authors: 'Kenta & Aoi', genre: 'Fantasy', cover: 'https://via.placeholder.com/400x600/ff8c42/ffffff?text=Cover+Art', rating: '4.9' },
    { id: '102', title: 'Neon Nights', authors: 'Rin & Jin', genre: 'Action', cover: 'https://via.placeholder.com/400x600/2a2420/ffffff?text=Neon+Nights', rating: '4.7' },
    { id: '103', title: 'Whispers in the Rain', authors: 'Yuki & Sora', genre: 'Slice of Life', cover: 'https://via.placeholder.com/400x600/a3c2c2/ffffff?text=Whispers', rating: '4.8' }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Public Gallery</h1>
        <p style={{ color: 'var(--text-muted)' }}>Read completed manga and stories from our creator community</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {publishedWorks.map(work => (
          <Link href={`/gallery/${work.id}`} key={work.id}>
            <div style={{ 
              background: 'var(--card-bg)', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ height: '350px', backgroundImage: `url(${work.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{work.genre}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.2rem' }}>{work.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>By {work.authors}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>⭐ {work.rating}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Read Now →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
