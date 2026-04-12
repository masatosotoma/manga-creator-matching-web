"use client";

import { useState } from 'react';

export default function Messages() {
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const inbox = [
    { id: 1, name: "Kenta (Writer)", role: "writer", unread: true, lastMsg: "Hey, I loved your art portfolio! I have a dark fantasy short story that fits perfectly." },
    { id: 2, name: "Aoi (Artist)", role: "illustrator", unread: false, lastMsg: "Thanks for the script, I will start sketching tomorrow." }
  ];

  const conversation = [
    { sender: "Kenta (Writer)", text: "Hey, I loved your art portfolio! I have a dark fantasy short story that fits perfectly.", time: "10:30 AM" }
  ];

  const sendReply = (e) => {
    e.preventDefault();
    if(!replyText) return;
    alert(`Sent message: ${replyText}`);
    setReplyText('');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', gap: '2rem', height: 'calc(100vh - 70px)' }}>
      {/* Inbox Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', paddingRight: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Messages</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          {inbox.map(msg => (
            <div 
              key={msg.id} 
              onClick={() => setActiveMessage(msg)}
              style={{ 
                padding: '1rem', 
                background: activeMessage?.id === msg.id ? 'var(--card-bg)' : 'transparent',
                border: activeMessage?.id === msg.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {msg.unread && <span style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%' }}></span>}
              <h4 style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{msg.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {msg.lastMsg}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {activeMessage ? (
          <>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontWeight: 700 }}>{activeMessage.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{activeMessage.role === 'writer' ? 'Novelist' : 'Illustrator'}</p>
            </div>
            
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {conversation.map((c, i) => (
                <div key={i} style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', maxWidth: '80%', alignSelf: 'flex-start' }}>
                  <p>{c.text}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>{c.time}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <form onSubmit={sendReply} style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  placeholder="Type a message..." 
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '99px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '99px' }}>Send</button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
