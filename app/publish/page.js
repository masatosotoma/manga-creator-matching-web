"use client";

import { useState } from 'react';

export default function PublishForm() {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    alert('🎉 Congratulations! Your Manga has been published to the Public Gallery!');
    window.location.href = '/gallery';
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '700px', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Publish Your Work</h1>
          <p style={{ color: 'var(--text-muted)' }}>Share your finalized Manga with the world!</p>
        </div>

        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Title of the Work</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Last Samurai Apprentice" 
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Synopsis</label>
            <textarea rows="5" required value={synopsis} onChange={e => setSynopsis(e.target.value)} placeholder="Write a compelling hook..." 
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Genre</label>
            <select required value={genre} onChange={e => setGenre(e.target.value)} 
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}>
              <option value="" disabled>Select a genre</option>
              <option value="action">Action / Shonen</option>
              <option value="romance">Romance / Shojo</option>
              <option value="fantasy">Fantasy / Isekai</option>
              <option value="horror">Horror</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,140,66,0.05)', padding: '1.5rem', border: '2px dashed var(--primary)', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontWeight: 600, color: 'var(--primary)' }}>Upload Final Reading Pages</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload images in order (PNG, JPG). For Webtoon style, these images will stitch vertically.</p>
            <input type="file" required multiple accept="image/*" style={{ margin: '1rem auto' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <input type="checkbox" required id="consent" />
              <label htmlFor="consent" style={{ fontSize: '0.85rem' }}>I confirm we have right to publish this work.</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            Post to Public Gallery
          </button>
        </form>

      </div>
    </div>
  );
}
