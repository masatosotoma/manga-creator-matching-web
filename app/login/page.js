"use client";

import { useState } from 'react';
import styles from '../register/register.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    alert(`Logged in as ${email}`);
    window.location.href = '/dashboard';
  };

  return (
    <div className="container">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>Welcome Back</h2>
          <p className={styles.authSubtitle}>Log in to continue your creative projects</p>
          
          <form onSubmit={handleLogin} className={styles.authForm}>
            
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
              Log In
            </button>
          </form>
          
          <div className={styles.authFooter}>
            Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
