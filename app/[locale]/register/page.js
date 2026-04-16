"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './register.module.css';
import { useTranslation } from '../../../components/TranslationProvider';

function RegisterForm() {
  const dict = useTranslation();
  const searchParams = useSearchParams();
  const initRole = searchParams.get('role') || '';
  
  const [role, setRole] = useState(initRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!role) {
      alert(dict.register.alertRole);
      return;
    }
    // Simulation since firebase credentials are dummy
    alert(`${dict.register.alertSuccess} ${email} ${dict.register.as} ${role}!`);
    window.location.href = `/${dict.locale}/profile/${role}`;
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>{dict.register.title}</h2>
        <p className={styles.authSubtitle}>{dict.register.subtitle}</p>
        
        <form onSubmit={handleRegister} className={styles.authForm}>
          
          <div className={styles.roleSelection}>
            <p className={styles.roleLabel}>{dict.register.iam}</p>
            <div className={styles.roleButtons}>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'writer' ? styles.roleActive : ''}`} 
                onClick={() => setRole('writer')}
              >
                ✍️ {dict.register.writer}
              </button>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'illustrator' ? styles.roleActive : ''}`} 
                onClick={() => setRole('illustrator')}
              >
                🎨 {dict.register.illustrator}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>{dict.register.email}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>{dict.register.password}</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
            {dict.register.submit}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          {dict.register.accountExists} <a href={`/${dict.locale}/login`} style={{ color: 'var(--primary)', fontWeight: '600' }}>{dict.register.login}</a>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const dict = useTranslation();
  return (
    <div className="container">
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '5rem' }}>{dict?.register?.loading || 'Loading...'}</div>}>
         <RegisterForm />
      </Suspense>
    </div>
  );
}
