"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '../../../../components/TranslationProvider';

export default function CreateProject() {
  const dict = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';

  // --- FORM STATE ---
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Manga'); // Manga | Webtoon | Graphic Novel | Comic Strip
  const [genre, setGenre] = useState('Fantasy'); // Action | Romance | Fantasy | Horror | Slice of Life | Sci-Fi
  const [demographic, setDemographic] = useState('Shonen'); // Shonen | Shojo | Seinen | Josei | All Ages
  const [synopsis, setSynopsis] = useState('');
  const [scale, setScale] = useState('One-shot'); // One-shot | Short Series | Long Series
  const [artVibe, setArtVibe] = useState('High Contrast Ink'); // High Contrast | Neon | Soft Pastel | Cinematic
  const [rolesNeeded, setRolesNeeded] = useState(['Illustrator']); // Writer, Illustrator, Inker, Colorist, Storyboarder
  
  // --- UX STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProjId, setCreatedProjId] = useState('');

  // Genre options
  const genres = [
    { key: 'Action', label: dict?.publish?.genreAction || 'Action / Shonen', value: 'Action' },
    { key: 'Romance', label: dict?.publish?.genreRomance || 'Romance / Shojo', value: 'Romance' },
    { key: 'Fantasy', label: dict?.publish?.genreFantasy || 'Fantasy / Isekai', value: 'Fantasy' },
    { key: 'Horror', label: dict?.publish?.genreHorror || 'Horror', value: 'Horror' },
    { key: 'Slice of Life', label: dict?.profile?.genreSlice || 'Slice of Life', value: 'Slice of Life' },
    { key: 'Sci-Fi', label: 'Sci-Fi / Cyberpunk', value: 'Sci-Fi' }
  ];

  // Format styles
  const styles = [
    { id: 'Manga', name: 'Traditional Manga', desc: 'Black & white panels, right-to-left page flipping.', icon: '📖' },
    { id: 'Webtoon', name: 'Webtoon (Vertical)', desc: 'Full color scrolling layout, optimized for mobile readers.', icon: '📱' },
    { id: 'Graphic Novel', name: 'Graphic Novel', desc: 'Rich multi-panel cinematic narratives, full page grids.', icon: '📚' },
    { id: 'Comic Strip', name: 'Comic Strip (4-Koma)', desc: 'Episodic comedy layouts, standard 4-panel vertical structure.', icon: '🖼️' }
  ];

  // Demographic demographics
  const demographics = [
    { value: 'Shonen', label: 'Shōnen (Boys 12-18)' },
    { value: 'Shojo', label: 'Shōjo (Girls 12-18)' },
    { value: 'Seinen', label: 'Seinen (Young Men 18+)' },
    { value: 'Josei', label: 'Josei (Young Women 18+)' },
    { value: 'All Ages', label: 'All Ages' }
  ];

  // Scale scale
  const scales = [
    { id: 'One-shot', name: 'One-shot / Short Story', desc: '15-45 pages self-contained tale.' },
    { id: 'Short Series', name: 'Mini-Series', desc: '3-6 Chapters, ideal for initial pitching.' },
    { id: 'Long Series', name: 'Long-running Series', desc: 'Ongoing collaborative series.' }
  ];

  // Roles available
  const roles = [
    { value: 'Writer', label: 'Novelist / Scriptwriter' },
    { value: 'Illustrator', label: 'Lead Illustrator' },
    { value: 'Storyboarder', label: 'Storyboard / Layout Artist' },
    { value: 'Inker', label: 'Ink & Clean Lineartist' },
    { value: 'Colorist', label: 'Colorist & Screentoner' },
    { value: 'Letterer', label: 'Letterer & SFX Illustrator' }
  ];

  const handleRoleToggle = (val) => {
    if (rolesNeeded.includes(val)) {
      if (rolesNeeded.length > 1) {
        setRolesNeeded(rolesNeeded.filter(r => r !== val));
      }
    } else {
      setRolesNeeded([...rolesNeeded, val]);
    }
  };

  const getGradientForGenre = (g) => {
    switch (g) {
      case 'Romance':
        return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
      case 'Horror':
        return 'linear-gradient(135deg, #130cb7 0%, #52e5e7 100%)';
      case 'Fantasy':
        return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      case 'Action':
        return 'linear-gradient(135deg, #ff8c42 0%, #ff5e62 100%)';
      case 'Slice of Life':
        return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
      case 'Sci-Fi':
        return 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)';
      default:
        return 'linear-gradient(135deg, #abecd6 0%, #fbed96 100%)';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newProjId = 'user-proj-' + Date.now();
      const newProject = {
        id: newProjId,
        title: title || 'Untitled Masterpiece',
        style,
        genre,
        demographic,
        synopsis,
        scale,
        artVibe,
        rolesNeeded,
        createdAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        // Save project detail
        localStorage.setItem(`manga_project_${newProjId}`, JSON.stringify(newProject));

        // Save into list
        const existingListStr = localStorage.getItem('manga_custom_projects');
        let existingList = [];
        if (existingListStr) {
          try {
            existingList = JSON.parse(existingListStr);
          } catch(err) {
            existingList = [];
          }
        }
        existingList.unshift(newProject);
        localStorage.setItem('manga_custom_projects', JSON.stringify(existingList));
      }

      setCreatedProjId(newProjId);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', position: 'relative' }}>
      
      {/* SUCCESS SCREEN OVERLAY */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease forwards'
        }}>
          {/* CONFETTI ELEMENTS */}
          <div className="confetti-container" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
            {[...Array(30)].map((_, i) => {
              const colors = ['#FF8C42', '#3b82f6', '#ec4899', '#28a745', '#f6d365'];
              const left = Math.random() * 100;
              const delay = Math.random() * 3;
              const duration = 2.5 + Math.random() * 2;
              const size = 6 + Math.random() * 10;
              const rotation = Math.random() * 360;
              return (
                <div 
                  key={i} 
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: colors[i % colors.length],
                    borderRadius: i % 2 === 0 ? '50%' : '2px',
                    transform: `rotate(${rotation}deg)`,
                    animation: `fall ${duration}s linear ${delay}s infinite`,
                    opacity: 0.8
                  }}
                />
              );
            })}
          </div>

          <div style={{
            background: 'var(--card-bg)',
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            maxWidth: '550px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid var(--border-color)',
            transform: 'scale(0.9)',
            animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '99px',
              background: 'rgba(40,167,69,0.1)',
              color: '#28a745',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(40,167,69,0.2)'
            }}>
              ✓
            </div>
            
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              {dict?.createProject?.successTitle || '🎉 Manga Project Initialized!'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              {dict?.createProject?.successMessage || 'Your new manga workspace is ready. You can now start scriptwriting, upload storyboards, and invite creative partners.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link 
                href={`/${locale}/workspace/${createdProjId}`} 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                {dict?.createProject?.goToWorkspace || 'Go to Project Workspace'}
              </Link>
              <Link 
                href={`/${locale}/dashboard`} 
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                {dict?.createProject?.backToDashboard || 'Back to Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Link href={`/${locale}/dashboard`} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
          ← {dict?.createProject?.backToDashboard || 'Back to Dashboard'}
        </Link>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
          {dict?.createProject?.title || 'Create New Manga Project'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px' }}>
          {dict?.createProject?.subtitle || 'Define your manga vision, choose your style, and find the perfect partner to bring it to life.'}
        </p>
      </div>

      {/* TWO-COLUMN CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'flex-start' }} className="create-grid">
        
        {/* LEFT COLUMN: FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* STEP 1: MANGA IDENTITY */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>1. Manga Identity</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {dict?.createProject?.mangaTitleLabel || 'Manga Title'} <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder={dict?.createProject?.mangaTitlePlaceholder || 'e.g. Shadow of the Dojo'}
                className="workspace-input" 
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {dict?.createProject?.synopsisLabel || 'Synopsis & Pitch'}
              </label>
              <textarea 
                value={synopsis} 
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder={dict?.createProject?.synopsisPlaceholder || 'What is your story about? Provide a brief hook...'}
                className="workspace-input"
                style={{ minHeight: '100px', resize: 'vertical', width: '100%' }}
              />
            </div>
          </section>

          {/* STEP 2: FORMAT & STYLE */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. Format & Layout Style</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {styles.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{
                    border: style === s.id ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                    background: style === s.id ? 'rgba(255, 140, 66, 0.03)' : 'var(--bg-color)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  className="selectable-card"
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{s.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{s.desc}</p>
                  
                  {style === s.id && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* STEP 3: STORY & DEMOGRAPHICS */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>3. Genre & Core Audience</h3>

            {/* GENRE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dict?.createProject?.genreLabel || 'Primary Genre'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {genres.map(g => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGenre(g.value)}
                    style={{
                      background: genre === g.value ? 'var(--primary)' : 'var(--bg-color)',
                      color: genre === g.value ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      padding: '0.45rem 1rem',
                      borderRadius: '99px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DEMOGRAPHICS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dict?.createProject?.targetAudienceLabel || 'Target Demographic'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {demographics.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDemographic(d.value)}
                    style={{
                      background: demographic === d.value ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-color)',
                      color: demographic === d.value ? '#3b82f6' : 'var(--text-main)',
                      border: demographic === d.value ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCALE AND SCALE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dict?.createProject?.projectScaleLabel || 'Project Scale'}</label>
                <select 
                  value={scale} 
                  onChange={(e) => setScale(e.target.value)}
                  className="workspace-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="One-shot">One-shot / Short Manga</option>
                  <option value="Short Series">Mini-Series (3-6 Chapters)</option>
                  <option value="Long Series">Long Series (Ongoing)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Art Vibe & Tone</label>
                <select 
                  value={artVibe} 
                  onChange={(e) => setArtVibe(e.target.value)}
                  className="workspace-input"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="High Contrast Ink">High Contrast Ink (Action/Samurai)</option>
                  <option value="Soft Pastel Outline">Soft Pastel / Outline (Romance)</option>
                  <option value="Cinematic Sketch">Cinematic / Highly Detailed Sketch</option>
                  <option value="Neon Cyberpunk">Neon Cyberpunk / Dynamic Shadows</option>
                  <option value="Chibi Cute">Chibi / Cute (Comedy)</option>
                </select>
              </div>
            </div>

          </section>

          {/* STEP 4: COLLABORATION DETAILS */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>4. Collaboration Setup</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>{dict?.createProject?.rolesNeededLabel || 'Collaborators Needed'}</label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Select the creative roles you are looking to match with:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {roles.map(r => (
                  <div
                    key={r.value}
                    onClick={() => handleRoleToggle(r.value)}
                    style={{
                      border: '1px solid var(--border-color)',
                      background: rolesNeeded.includes(r.value) ? 'rgba(40, 167, 69, 0.05)' : 'var(--bg-color)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={rolesNeeded.includes(r.value)}
                      readOnly
                      style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ 
              alignSelf: 'flex-start', 
              padding: '0.85rem 2rem', 
              fontSize: '1.05rem', 
              boxShadow: '0 8px 24px rgba(255, 140, 66, 0.3)',
              width: '100%',
              maxWidth: '280px',
              marginTop: '1rem'
            }}
          >
            {isSubmitting ? 'Initializing Workspace...' : (dict?.createProject?.submitButton || 'Launch Project Workspace')}
          </button>
        </form>

        {/* RIGHT COLUMN: PREVIEW STICKY */}
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Live Visual Card Preview</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>See what your project card will look like in active projects dashboard</p>
          </div>

          {/* PROJECT CARD */}
          <div className="project-card" style={{ cursor: 'default', pointerEvents: 'none' }}>
            
            {/* CARD BANNER */}
            <div className="project-card-banner" style={{ 
              background: getGradientForGenre(genre),
              height: '110px',
              position: 'relative'
            }}>
              <div className="project-card-overlay" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                <span className="project-card-badge">Initiating...</span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: 'white', 
                  background: 'rgba(0,0,0,0.4)', 
                  padding: '0.15rem 0.4rem', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)'
                }}>
                  {style}
                </span>
              </div>
            </div>

            {/* CARD BODY */}
            <div className="project-card-body">
              <h3 className="project-card-title" style={{ minHeight: '1.5rem' }}>
                {title || 'Untitled Masterpiece'}
              </h3>
              
              <div className="project-card-meta">
                <span>Genre: <strong>{genre}</strong></span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Just now</span>
              </div>

              {/* PROGRESS BAR */}
              <div className="project-progress-container">
                <div className="project-progress-text">
                  <span>Progress</span>
                  <span>15%</span>
                </div>
                <div className="project-progress-bar">
                  <div className="project-progress-fill" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="project-card-footer">
                <span style={{ fontStyle: 'italic', fontSize: '0.75rem', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  "Workspace initialized. Matching pending..."
                </span>
                
                {/* AVATARS */}
                <div className="avatar-group">
                  <div className="avatar-bubble avatar-writer" title="You">Y</div>
                  <div className="avatar-bubble" style={{ background: '#b0ada8', color: 'white' }} title="Match Pending">?</div>
                </div>
              </div>

            </div>
          </div>

          {/* ADDITIONAL FORM SUMMARY */}
          <div style={{ background: 'var(--card-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p><strong>Audience Demographics:</strong> {demographic}</p>
            <p><strong>Art Tone:</strong> {artVibe}</p>
            <p><strong>Scale:</strong> {scale}</p>
            <p><strong>Required Roles:</strong> {rolesNeeded.join(', ')}</p>
          </div>
        </aside>

      </div>

      {/* CONFETTI ANIMATION STYLES */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fall {
          0% {
            top: -5%;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            top: 105%;
            transform: translateY(100vh) rotate(720deg);
          }
        }
        @media(max-width: 900px) {
          .create-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
