"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../../../components/TranslationProvider';

export default function AdminPage() {
  const dict = useTranslation();
  const adminDict = dict.admin || {};

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const body = await res.json();
      setUsers(body.users || []);
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const performAction = async (action, userId, opts = {}) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...opts })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'action failed');
      await fetchUsers();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {adminDict.title || 'User Management'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {adminDict.subtitle || 'Manage platform users and moderation'}
        </p>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>{adminDict.name || 'Name'}</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>{adminDict.role || 'Role'}</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>{adminDict.style || 'Style'}</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>{adminDict.status || 'Status'}</th>
                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>{adminDict.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', background: u.status === 'suspended' ? 'var(--bg-color)' : 'transparent' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: u.role === 'writer' ? '#e0f2fe' : '#fce7f3', 
                      color: u.role === 'writer' ? '#0369a1' : '#be185d',
                      padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.style}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: u.status === 'active' ? '#dcfce7' : '#fee2e2', 
                      color: u.status === 'active' ? '#166534' : '#991b1b',
                      padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 
                    }}>
                      {u.status === 'active' ? (adminDict.active || 'Active') : (adminDict.suspended || 'Suspended')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => performAction('toggleStatus', u.id)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      {u.suspended ? (adminDict.activate || 'Activate') : (adminDict.suspend || 'Suspend')}
                    </button>
                    <button 
                      onClick={() => performAction('delete', u.id)}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#ef4444', borderColor: '#ef4444' }}
                    >
                      {adminDict.delete || 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td>
                </tr>
              )}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
