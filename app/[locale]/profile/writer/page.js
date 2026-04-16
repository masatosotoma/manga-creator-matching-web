"use client";

import { useState } from 'react';
import styles from '../../register/register.module.css';
import { useTranslation } from '../../../../components/TranslationProvider';

export default function WriterProfileSetup() {
  const dict = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('');
  const [projectIntent, setProjectIntent] = useState('short');

  const handleSave = (e) => {
    e.preventDefault();
    alert(dict.profile.writerSaved);
    window.location.href = `/${dict.locale}/dashboard`;
  };

  return (
    <div className="container">
      <div className={styles.authContainer} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className={styles.authCard} style={{ maxWidth: '600px' }}>
          <h2 className={styles.authTitle}>{dict.profile.writerTitle}</h2>
          <p className={styles.authSubtitle}>{dict.profile.writerSubtitle}</p>
          
          <form onSubmit={handleSave} className={styles.authForm}>
            
            <div className={styles.formGroup}>
              <label>{dict.profile.displayName}</label>
              <input type="text" required value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder={dict.profile.penName} />
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.writerBio}</label>
              <textarea rows="4" required value={bio} onChange={(e)=>setBio(e.target.value)} placeholder={dict.profile.writerBioPlaceholder}></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.topGenre}</label>
              <select value={genre} onChange={(e)=>setGenre(e.target.value)} required>
                <option value="" disabled>{dict.profile.selectGenre}</option>
                <option value="action">{dict.profile.genreAction}</option>
                <option value="romance">{dict.profile.genreRomance}</option>
                <option value="fantasy">{dict.profile.genreFantasy}</option>
                <option value="horror">{dict.profile.genreHorror}</option>
                <option value="slice">{dict.profile.genreSlice}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.projectIntent}</label>
              <select value={projectIntent} onChange={(e)=>setProjectIntent(e.target.value)}>
                <option value="short">{dict.profile.intentShort}</option>
                <option value="long">{dict.profile.intentLong}</option>
                <option value="hobby">{dict.profile.intentHobby}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.uploadScript}</label>
              <input type="file" accept=".pdf, .txt, .doc, .docx" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem' }}>
              {dict.profile.saveProfile}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
