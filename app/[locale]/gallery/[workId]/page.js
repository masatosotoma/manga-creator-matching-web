"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Reader() {
  const params = useParams();
  const workId = params?.workId || 'demo';

  // Dummy webtoon pages
  const pages = [
    'https://via.placeholder.com/800x1200/2a2420/ffffff?text=Page+1',
    'https://via.placeholder.com/800x1200/3d352e/ffffff?text=Page+2',
    'https://via.placeholder.com/800x1200/ff8c42/ffffff?text=Page+3'
  ];

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#fff', margin: '0', padding: '0', display: 'flex', flexDirection: 'column' }}>
      
      {/* Reader Navbar */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(17,17,17,0.95)', borderBottom: '1px solid #333', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
          <Link href="/gallery" style={{ color: '#aaa', fontWeight: 600, textDecoration: 'none' }}>← Back to Gallery</Link>
          <span style={{ fontWeight: 700, display: 'none' }} className="mobile-hide">The Last Samurai Apprentice - Chapter 1</span>
          <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Subscribe</button>
        </div>
      </div>

      {/* Webtoon Content (Vertical Scroll) */}
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        {pages.map((imgUrl, i) => (
          <img 
            key={i} 
            src={imgUrl} 
            alt={`Page ${i+1}`} 
            style={{ width: '100%', display: 'block', objectFit: 'contain', margin: '0', padding: '0' }} 
            loading="lazy"
          />
        ))}
      </div>

      {/* Reader Footer */}
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '3rem 1rem', borderTop: '1px solid #333', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>End of Chapter 1</h3>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Support the creators by leaving a comment or liking their work!</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{ background: '#333', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>❤️ Like (1.2k)</button>
          <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Next Chapter →</button>
        </div>
      </div>
      
      {/* Basic inline style to map mobile-hide class for the span */}
      <style dangerouslySetInnerHTML={{__html: `
        @media(max-width: 600px) {
          .mobile-hide { display: none !important; }
        }
        @media(min-width: 601px) {
          .mobile-hide { display: inline-block !important; }
        }
      `}} />
    </div>
  );
}
