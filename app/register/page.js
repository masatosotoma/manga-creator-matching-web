"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './register.module.css';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initRole = searchParams.get('role') || '';
  
  const [role, setRole] = useState(initRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select a role.");
      return;
    }
    // Simulation since firebase credentials are dummy
    alert(`Account created for ${email} as ${role}!`);
    window.location.href = `/profile/${role}`;
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Join MangaCollab</h2>
        <p className={styles.authSubtitle}>Start your creative journey today</p>
        
        <form onSubmit={handleRegister} className={styles.authForm}>
          
          <div className={styles.roleSelection}>
            <p className={styles.roleLabel}>I am a...</p>
            <div className={styles.roleButtons}>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'writer' ? styles.roleActive : ''}`} 
                onClick={() => setRole('writer')}
              >
                ✍️ Writer
              </button>
              <button 
                type="button" 
                className={`${styles.roleBtn} ${role === 'illustrator' ? styles.roleActive : ''}`} 
                onClick={() => setRole('illustrator')}
              >
                🎨 Illustrator
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
            Create Account
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log In</a>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <div className="container">
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading form...</div>}>
         <RegisterForm />
      </Suspense>
    </div>
  );
}
