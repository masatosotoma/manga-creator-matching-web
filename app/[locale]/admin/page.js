"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../../../components/TranslationProvider';

export default function AdminPage() {
  const dict = useTranslation();
  const adminDict = dict.admin || {};

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // User States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [banReasonKey, setBanReasonKey] = useState('spam');
  const [customBanReason, setCustomBanReason] = useState('');

  // Check sessionStorage for token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('adminToken');
      if (token === 'mock-admin-token-12345') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch Users
  const fetchUsers = async () => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('adminToken');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const body = await res.json();
      if (res.ok) {
        setUsers(body.users || []);
      } else {
        console.error('Failed to fetch users:', body.error);
        if (res.status === 401) {
          handleLogout();
        }
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminEmail', data.user.email);
        setIsAuthenticated(true);
      } else {
        setLoginError(adminDict.invalidCredentials || 'Invalid admin email or password.');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setUsers([]);
  };

  // Perform User Actions
  const performAction = async (action, userId, opts = {}) => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, userId, ...opts })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Action failed');
      await fetchUsers();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  // Action Triggers
  const handleDelete = (userId, name) => {
    const confirmMsg = dict.locale === 'ja' 
      ? `本当にユーザー「${name}」を削除しますか？`
      : `Are you sure you want to delete user "${name}"?`;
    if (confirm(confirmMsg)) {
      performAction('delete', userId);
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanReasonKey('spam');
    setCustomBanReason('');
    setShowBanModal(true);
  };

  const handleBanSubmit = () => {
    if (!selectedUser) return;
    
    let reasonText = '';
    if (banReasonKey === 'spam') reasonText = adminDict.banReasonSpam || 'Spamming/Unsolicited ads';
    else if (banReasonKey === 'abusive') reasonText = adminDict.banReasonAbusive || 'Abusive behavior or harassment';
    else if (banReasonKey === 'copyright') reasonText = adminDict.banReasonCopyright || 'Violating Section 3 copyright rules';
    else reasonText = customBanReason || adminDict.banReasonOther || 'Other violation';

    performAction('toggleStatus', selectedUser.id, { reason: reasonText });
    setShowBanModal(false);
    setSelectedUser(null);
  };

  const handleReactivate = (user) => {
    performAction('toggleStatus', user.id);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Statistics calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'suspended' && !u.suspended).length;
  const suspendedUsers = users.filter(u => u.status === 'suspended' || u.suspended).length;
  const flaggedUsers = users.filter(u => u.reportsCount > 0).length;

  // Filtered users calculation
  const filteredUsers = users.filter(u => {
    // search filter
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.style?.toLowerCase().includes(searchTerm.toLowerCase());

    // role filter
    const matchesRole = 
      roleFilter === 'all' || 
      (roleFilter === 'writer' && u.role === 'writer') || 
      (roleFilter === 'illustrator' && u.role === 'illustrator');

    // status filter
    const isSuspended = u.status === 'suspended' || u.suspended === true;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && !isSuspended) || 
      (statusFilter === 'suspended' && isSuspended);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Avatar generation helper
  const getAvatarBg = (name) => {
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];
    const charCode = name ? name.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  // Date formatting helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(dict.locale || 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Unauthenticated Login view
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 140, 66, 0.05) 100%)',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 140, 66, 0.15)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          top: '-50px',
          right: '-50px',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          background: 'rgba(255, 160, 122, 0.12)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          bottom: '-50px',
          left: '-50px',
          zIndex: 1
        }} />

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
          width: '100%',
          maxWidth: '480px',
          padding: '3rem 2.5rem',
          zIndex: 2,
          position: 'relative',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 8px 16px rgba(255, 140, 66, 0.3)',
              marginBottom: '1rem'
            }}>
              ⚙️
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {adminDict.loginTitle || 'Master Admin Access'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {adminDict.loginSubtitle || 'Enter your credentials to access the control panel'}
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loginError && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                {loginError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {adminDict.emailLabel || 'Admin Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>📧</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mangacollab.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {adminDict.passwordLabel || 'Admin Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>🔒</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                borderRadius: '12px',
                marginTop: '1rem'
              }}
            >
              {loginLoading ? '...' : (adminDict.loginButton || 'Secure Log In')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard view
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
      
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            {adminDict.title || 'User Management'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {adminDict.subtitle || 'Manage platform users and moderation'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            👑 masatosotoma@gmail.com
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
          >
            {adminDict.logout || 'Log Out'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Users */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{ fontSize: '2.25rem' }}>👥</div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {adminDict.statsTotal || 'Total Users'}
            </p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{totalUsers}</h3>
          </div>
        </div>

        {/* Active Users */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{ fontSize: '2.25rem' }}>🟢</div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {adminDict.statsActive || 'Active Users'}
            </p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>{activeUsers}</h3>
          </div>
        </div>

        {/* Suspended Users */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{ fontSize: '2.25rem' }}>🔴</div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {adminDict.statsSuspended || 'Suspended Users'}
            </p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', margin: 0 }}>{suspendedUsers}</h3>
          </div>
        </div>

        {/* Flagged Accounts */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{ fontSize: '2.25rem' }}>⚠️</div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {adminDict.statsFlagged || 'Flagged Accounts'}
            </p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', margin: 0 }}>{flaggedUsers}</h3>
          </div>
        </div>
      </div>

      {/* Control bar (Filters + Search) */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px 16px 0 0',
        padding: '1.25rem 1.5rem',
        borderBottom: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={adminDict.searchPlaceholder || 'Search users by name, email or ID...'}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">{adminDict.roleFilterAll || 'All Roles'}</option>
            <option value="writer">{adminDict.roleFilterWriters || 'Writers'}</option>
            <option value="illustrator">{adminDict.roleFilterIllustrators || 'Illustrators'}</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">{adminDict.statusFilterAll || 'All Statuses'}</option>
            <option value="active">{adminDict.statusFilterActive || 'Active Only'}</option>
            <option value="suspended">{adminDict.statusFilterSuspended || 'Suspended Only'}</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: '0 0 16px 16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{adminDict.name || 'Name'}</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{adminDict.role || 'Role'}</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{adminDict.style || 'Style'}</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Behavior</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{adminDict.status || 'Status'}</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>{adminDict.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSuspended = u.status === 'suspended' || u.suspended === true;
                return (
                  <tr key={u.id} style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: isSuspended ? 'rgba(239, 68, 68, 0.02)' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}>
                    {/* ID */}
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      #{u.id}
                    </td>

                    {/* Name / User details */}
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: getAvatarBg(u.name),
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}>
                          {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email || `${u.name.toLowerCase()}@example.com`}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{
                        background: u.role === 'writer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                        color: u.role === 'writer' ? '#1d4ed8' : '#be185d',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '99px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {u.role === 'writer' ? (dict.register?.writer || 'Writer') : (dict.register?.illustrator || 'Illustrator')}
                      </span>
                    </td>

                    {/* Style */}
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {u.style}
                    </td>

                    {/* Behavior Status */}
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {u.reportsCount > 0 ? (
                        <span style={{
                          background: 'rgba(217, 119, 6, 0.1)',
                          color: '#b45309',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          ⚠️ {adminDict.behaviorFlagged || 'Flagged'} ({u.reportsCount} {adminDict.reports || 'reports'})
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(22, 163, 74, 0.1)',
                          color: '#15803d',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          🟢 {adminDict.behaviorGood || 'Good'}
                        </span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{
                        background: isSuspended ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                        color: isSuspended ? '#b91c1c' : '#15803d',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '99px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        {isSuspended ? (adminDict.suspended || 'Suspended') : (adminDict.active || 'Active')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => openDetailsModal(u)}
                          className="btn btn-outline"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            borderRadius: '8px',
                            borderWidth: '1px'
                          }}
                        >
                          👁️ Details
                        </button>
                        
                        {isSuspended ? (
                          <button
                            onClick={() => handleReactivate(u)}
                            className="btn btn-primary"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              background: '#16a34a',
                              borderColor: '#16a34a',
                              boxShadow: 'none'
                            }}
                          >
                            🔓 {adminDict.activate || 'Activate'}
                          </button>
                        ) : (
                          <button
                            onClick={() => openBanModal(u)}
                            className="btn btn-outline"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              color: '#dc2626',
                              borderColor: '#fca5a5'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            🚫 {adminDict.suspend || 'Suspend'}
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="btn btn-primary"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            borderRadius: '8px',
                            background: '#ef4444',
                            borderColor: '#ef4444',
                            boxShadow: 'none'
                          }}
                        >
                          🗑️ {adminDict.delete || 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(255,140,66,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Loading user directory...</p>
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    🔍 No users match the current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banning Modal */}
      {showBanModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🚫 {adminDict.banModalTitle || 'Suspend User Account'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {adminDict.banModalSubtitle || 'Please specify the reason for suspending the account of'} <strong>{selectedUser.name}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {adminDict.banReasonLabel || 'Select or Enter Reason'}
              </label>

              <select
                value={banReasonKey}
                onChange={(e) => setBanReasonKey(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <option value="spam">{adminDict.banReasonSpam || 'Spamming/Unsolicited ads'}</option>
                <option value="abusive">{adminDict.banReasonAbusive || 'Abusive behavior or harassment'}</option>
                <option value="copyright">{adminDict.banReasonCopyright || 'Violating Section 3 copyright rules'}</option>
                <option value="other">{adminDict.banReasonOther || 'Other violation'}</option>
              </select>

              {banReasonKey === 'other' && (
                <textarea
                  value={customBanReason}
                  onChange={(e) => setCustomBanReason(e.target.value)}
                  placeholder={adminDict.banReasonCustomPlaceholder || 'Provide additional details for the suspension...'}
                  rows="3"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              >
                {adminDict.cancel || 'Cancel'}
              </button>
              <button
                onClick={banReasonKey === 'other' && !customBanReason.trim() ? undefined : handleBanSubmit}
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.9rem',
                  background: '#dc2626',
                  borderColor: '#dc2626',
                  opacity: (banReasonKey === 'other' && !customBanReason.trim()) ? 0.5 : 1
                }}
                disabled={banReasonKey === 'other' && !customBanReason.trim()}
              >
                {adminDict.confirmBan || 'Confirm Account Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Audit Modal */}
      {showDetailsModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                📋 {adminDict.userDetailsTitle || 'User Audit Details'}
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUser(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  opacity: 0.5,
                  padding: '0.2rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Card Summary */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                background: 'var(--bg-color)'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: getAvatarBg(selectedUser.name),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}>
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{selectedUser.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedUser.email}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{
                    background: selectedUser.role === 'writer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                    color: selectedUser.role === 'writer' ? '#1d4ed8' : '#be185d',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}>
                    {selectedUser.role}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {selectedUser.style}
                  </span>
                </div>
              </div>

              {/* Status & Creation Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {adminDict.userRegistered || 'Registered on'}
                  </h5>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {adminDict.status || 'Status'}
                  </h5>
                  <div>
                    <span style={{
                      background: (selectedUser.status === 'suspended' || selectedUser.suspended) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                      color: (selectedUser.status === 'suspended' || selectedUser.suspended) ? '#b91c1c' : '#15803d',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '99px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      {(selectedUser.status === 'suspended' || selectedUser.suspended) ? (adminDict.suspended || 'Suspended') : (adminDict.active || 'Active')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suspension Reason display if suspended */}
              {(selectedUser.status === 'suspended' || selectedUser.suspended) && (
                <div style={{
                  border: '1px solid #fca5a5',
                  background: 'rgba(239, 68, 68, 0.02)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <h5 style={{ fontSize: '0.85rem', color: '#b91c1c', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    🚫 {adminDict.suspendedReasonLabel || 'Suspension Reason'}
                  </h5>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {selectedUser.suspendedReason || 'Violating behavior guidelines'}
                  </p>
                  {selectedUser.suspendedAt && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {adminDict.suspendedAlert || 'Suspended on'}: {formatDate(selectedUser.suspendedAt)}
                    </span>
                  )}
                </div>
              )}

              {/* Reports Log */}
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  ⚠️ {adminDict.behaviorReportsLog || 'Behavior Reports Log'} ({selectedUser.reports?.length || 0})
                </h5>

                {!selectedUser.reports || selectedUser.reports.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                    {adminDict.noReports || 'No reports submitted for this user.'}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedUser.reports.map((report) => (
                      <div key={report.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        background: 'var(--bg-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>
                            <strong>{adminDict.reporter || 'Reporter'}:</strong> {report.reporter}
                          </span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          <strong>{adminDict.reason || 'Reason'}:</strong> {report.reason}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <strong>{adminDict.details || 'Details'}:</strong> {report.details}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
