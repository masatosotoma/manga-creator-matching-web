"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '../../../../components/TranslationProvider';

export default function Workspace() {
  const dict = useTranslation();
  const params = useParams();
  const projectId = 'PROJECT-' + (params?.projectId || 'DEMO');
  
  const [messages, setMessages] = useState([
    { sender: 'Aoi (Artist)', text: dict.workspace.initMsg, time: '10:00 AM' }
  ]);
  const [textInput, setTextInput] = useState('');

  const sendMsg = (e) => {
    e.preventDefault();
    if (!textInput) return;
    setMessages([...messages, { sender: dict.workspace.me, text: textInput, time: dict.workspace.now }]);
    setTextInput('');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{dict.workspace.activeWorkspace}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{dict.workspace.demoTitle}</h1>
          <p style={{ color: 'var(--text-muted)' }}>ID: {projectId} • {dict.workspace.team}: Kenta & Aoi</p>
        </div>
        <div>
          <a href={`/${dict.locale}/publish`} className="btn btn-primary" style={{ background: '#28a745', boxShadow: '0 4px 14px rgba(40, 167, 69, 0.3)' }}>🚀 {dict.workspace.publishButton}</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column: Script / Writing */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>📝 {dict.workspace.scriptsTitle}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ fontWeight: 600 }}>{dict.workspace.demoScript}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{dict.workspace.uploadedByKenta}</p>
            </div>
          </div>
          
          <button className="btn btn-outline" style={{ width: '100%', borderStyle: 'dashed' }}>+ {dict.workspace.uploadScript}</button>
        </section>

        {/* Right Column: Art & Storyboards */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>🎨 {dict.workspace.artTitle}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ height: '120px', background: 'url(https://via.placeholder.com/150/ff8c42/ffffff?text=Sketch)', backgroundSize: 'cover', borderRadius: '8px' }}></div>
            <div style={{ height: '120px', background: 'url(https://via.placeholder.com/150/ffb07c/ffffff?text=Page1)', backgroundSize: 'cover', borderRadius: '8px' }}></div>
          </div>
          
          <button className="btn btn-outline" style={{ width: '100%', borderStyle: 'dashed', borderColor: '#4a90e2', color: '#4a90e2' }}>+ {dict.workspace.uploadArt}</button>
        </section>
      </div>

      {/* Collaboration Chat Floor */}
      <section style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '350px' }}>
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontWeight: 700 }}>{dict.workspace.chatTitle}</h3>
        </div>
        
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ padding: '0.75rem 1rem', background: m.sender === dict.workspace.me ? 'rgba(255,140,66,0.1)' : 'var(--bg-color)', borderRadius: '12px', alignSelf: m.sender === dict.workspace.me ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <p style={{ fontWeight: 600, fontSize: '0.8rem', color: m.sender === dict.workspace.me ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>{m.sender}</p>
              <p style={{ fontSize: '0.95rem' }}>{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMsg} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" value={textInput} onChange={e => setTextInput(e.target.value)} 
            placeholder={dict.workspace.typeMessage} 
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '99px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} 
          />
          <button type="submit" className="btn btn-primary">{dict.workspace.send}</button>
        </form>
      </section>

    </div>
  );
}
