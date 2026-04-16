"use client";

import { useState } from 'react';
import styles from '../register/register.module.css';
import { useTranslation } from '../../../components/TranslationProvider';

export default function Login() {
  const dict = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    alert(`${dict.login.alert} ${email}`);
    window.location.href = `/${dict.locale}/dashboard`;
  };

  return (
    <div className="container">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>{dict.login.title}</h2>
          <p className={styles.authSubtitle}>{dict.login.subtitle}</p>
          
          <form onSubmit={handleLogin} className={styles.authForm}>
            
            <div className={styles.formGroup}>
              <label>{dict.login.email}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label>{dict.login.password}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
              {dict.login.submit}
            </button>
          </form>
          
          <div className={styles.authFooter}>
            {dict.login.noAccount} <a href={`/${dict.locale}/register`} style={{ color: 'var(--primary)', fontWeight: '600' }}>{dict.login.signup}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
