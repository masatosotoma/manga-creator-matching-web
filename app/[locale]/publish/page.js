"use client";

import { useState } from 'react';
import { useTranslation } from '../../../components/TranslationProvider';

export default function PublishForm() {
  const dict = useTranslation();
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    alert(dict.publish.successAlert);
    window.location.href = `/${dict.locale}/gallery`;
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '700px', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{dict.publish.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{dict.publish.subtitle}</p>
        </div>

        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>{dict.publish.titleLabel}</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder={dict.publish.titlePlaceholder}
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>{dict.publish.synopsisLabel}</label>
            <textarea rows="5" required value={synopsis} onChange={e => setSynopsis(e.target.value)} placeholder={dict.publish.synopsisPlaceholder}
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>{dict.publish.genreLabel}</label>
            <select required value={genre} onChange={e => setGenre(e.target.value)} 
              style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}>
              <option value="" disabled>{dict.publish.genrePlaceholder}</option>
              <option value="action">{dict.publish.genreAction}</option>
              <option value="romance">{dict.publish.genreRomance}</option>
              <option value="fantasy">{dict.publish.genreFantasy}</option>
              <option value="horror">{dict.publish.genreHorror}</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,140,66,0.05)', padding: '1.5rem', border: '2px dashed var(--primary)', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontWeight: 600, color: 'var(--primary)' }}>{dict.publish.uploadTitle}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dict.publish.uploadDesc}</p>
            <input type="file" required multiple accept="image/*" style={{ margin: '1rem auto' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <input type="checkbox" required id="consent" />
              <label htmlFor="consent" style={{ fontSize: '0.85rem' }}>{dict.publish.consent}</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            {dict.publish.submit}
          </button>
        </form>

      </div>
    </div>
  );
}
