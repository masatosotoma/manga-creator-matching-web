"use client";

import { useState } from 'react';
import styles from '../../register/register.module.css';
import { useTranslation } from '../../../../components/TranslationProvider';

export default function IllustratorProfileSetup() {
  const dict = useTranslation();
  const [alias, setAlias] = useState('');
  const [bio, setBio] = useState('');
  const [styleTag, setStyleTag] = useState('');
  const [availability, setAvailability] = useState('part-time');

  const handleSave = (e) => {
    e.preventDefault();
    alert(dict.profile.illSaved);
    window.location.href = `/${dict.locale}/dashboard`;
  };

  return (
    <div className="container">
      <div className={styles.authContainer} style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className={styles.authCard} style={{ maxWidth: '600px' }}>
          <h2 className={styles.authTitle}>{dict.profile.illTitle}</h2>
          <p className={styles.authSubtitle}>{dict.profile.illSubtitle}</p>
          
          <form onSubmit={handleSave} className={styles.authForm}>
            
            <div className={styles.formGroup}>
              <label>{dict.profile.alias}</label>
              <input type="text" required value={alias} onChange={(e)=>setAlias(e.target.value)} placeholder={dict.profile.aliasPlaceholder} />
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.illBio}</label>
              <textarea rows="4" required value={bio} onChange={(e)=>setBio(e.target.value)} placeholder={dict.profile.illBioPlaceholder}></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.artStyle}</label>
              <select value={styleTag} onChange={(e)=>setStyleTag(e.target.value)} required>
                <option value="" disabled>{dict.profile.selectStyle}</option>
                <option value="anime">{dict.profile.styleAnime}</option>
                <option value="realistic">{dict.profile.styleRealistic}</option>
                <option value="chibi">{dict.profile.styleChibi}</option>
                <option value="dark">{dict.profile.styleDark}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.availability}</label>
              <select value={availability} onChange={(e)=>setAvailability(e.target.value)}>
                <option value="part-time">{dict.profile.availPart}</option>
                <option value="full-time">{dict.profile.availFull}</option>
                <option value="collaborative">{dict.profile.availCollab}</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.uploadPortfolio}</label>
              <div style={{ border: '2px dashed var(--border-color)', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
                <input type="file" accept="image/*" multiple />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{dict.profile.uploadNote}</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>{dict.profile.specialSkills}</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> {dict.profile.skillCharDesign}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> {dict.profile.skillBgArt}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" /> {dict.profile.skillPaneling}
                </label>
              </div>
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
