"use client";

import { useState } from 'react';
import styles from '../../register/register.module.css';

export default function IllustratorProfileSetup() {
  const [alias, setAlias] = useState('');
  const [bio, setBio] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [availability, setAvailability] = useState('part-time');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Illustrator Profile Saved!');
    window.location.href = '/dashboard';
  };

  return (
    <div className="container">
      <div className={styles.authContainer} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className={styles.authCard} style={{ maxWidth: '600px' }}>
          <h2 className={styles.authTitle}>Complete Illustrator Profile</h2>
          <p className={styles.authSubtitle}>Showcase your amazing art to writers</p>
          
          <form onSubmit={handleSave} className={styles.authForm}>
            
            <div className={styles.formGroup}>
              <label>Artist Alias / Name</label>
              <input type="text" required value={alias} onChange={(e)=>setAlias(e.target.value)} placeholder="Art by..." />
            </div>

            <div className={styles.formGroup}>
              <label>Bio & Inspiration</label>
              <textarea rows="4" required value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="e.g. Influenced by 90s anime and cyberpunk vibes..."></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Primary Art Style</label>
              <select value={styleTag} onChange={(e)=>setStyleTag(e.target.value)} required>
                <option value="" disabled>Select a style</option>
                <option value="anime">Anime / Manga</option>
                <option value="realistic">Semi-Realistic</option>
                <option value="chibi">Chibi / Cute</option>
                <option value="dark">Dark / Gothic</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Availability</label>
              <select value={availability} onChange={(e)=>setAvailability(e.target.value)}>
                <option value="part-time">Part-time (Hobbyist)</option>
                <option value="full-time">Full-time (Serious/Paid)</option>
                <option value="collaborative">Unpaid / Revenue Share</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Upload Portfolio Images (Mockup)</label>
              <div style={{ border: '2px dashed var(--border-color)', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
                <input type="file" accept="image/*" multiple />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Images will be uploaded to Firebase Storage</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Special Skills (Check all that apply)</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> Character Design
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> Background Art
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> Paneling / Layout
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem' }}>
              Save Profile & Enter App
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
