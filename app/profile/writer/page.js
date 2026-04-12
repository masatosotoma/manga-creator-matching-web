"use client";

import { useState } from 'react';
import styles from '../../register/register.module.css';

export default function WriterProfileSetup() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('');
  const [projectIntent, setProjectIntent] = useState('short');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Writer Profile Saved!');
    window.location.href = '/dashboard';
  };

  return (
    <div className="container">
      <div className={styles.authContainer} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className={styles.authCard} style={{ maxWidth: '600px' }}>
          <h2 className={styles.authTitle}>Complete Writer Profile</h2>
          <p className={styles.authSubtitle}>Tell illustrators about your stories</p>
          
          <form onSubmit={handleSave} className={styles.authForm}>
            
            <div className={styles.formGroup}>
              <label>Display Name</label>
              <input type="text" required value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder="Pen name" />
            </div>

            <div className={styles.formGroup}>
              <label>Bio & Writing Style</label>
              <textarea rows="4" required value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="e.g. I excel at dialogue and dark fantasy lore..."></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>Top Genre</label>
              <select value={genre} onChange={(e)=>setGenre(e.target.value)} required>
                <option value="" disabled>Select a genre</option>
                <option value="action">Action / Shonen</option>
                <option value="romance">Romance / Shojo</option>
                <option value="fantasy">Fantasy / Isekai</option>
                <option value="horror">Horror / Thriller</option>
                <option value="slice">Slice of Life</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Project Intent</label>
              <select value={projectIntent} onChange={(e)=>setProjectIntent(e.target.value)}>
                <option value="short">Short Manga / One-shot</option>
                <option value="long">Long-running Series</option>
                <option value="hobby">Hobby Collaboration</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Upload Sample Script (Optional: PDF/TXT)</label>
              <input type="file" accept=".pdf, .txt, .doc, .docx" />
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
