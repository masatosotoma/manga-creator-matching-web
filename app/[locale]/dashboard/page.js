"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '../../../components/TranslationProvider';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const dict = useTranslation();

  // Mock Data
  const matches = [
    { id: 1, name: "Kenta (Writer)", matchStatus: "New", genre: "Fantasy", role: "writer" },
    { id: 2, name: "Aoi (Artist)", matchStatus: "Active", genre: "Anime", role: "illustrator" },
  ];

  const staticProjects = [
    { 
      id: "1", 
      title: "The Last Samurai Apprentice", 
      status: "In Progress", 
      role: "Illustrating",
      progress: 65,
      lastUpdate: "Aoi uploaded Chapter 1 sketches",
      lastUpdateTime: "2h ago",
      bannerImage: "/images/samurai_concept.png"
    }
  ];

  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customProjectsStr = localStorage.getItem('manga_custom_projects');
      if (customProjectsStr) {
        try {
          const customProjects = JSON.parse(customProjectsStr);
          // format them to match card structure
          const formattedCustom = customProjects.map(p => ({
            id: p.id,
            title: p.title,
            status: "In Progress",
            role: p.rolesNeeded?.includes("Writer") ? "Illustrating" : "Writing", // typically matched with opposite role
            progress: 15,
            lastUpdate: "Workspace initialized. Start drafting Chapter 1 script!",
            lastUpdateTime: "Just now",
            bannerImage: null, // will use CSS gradients based on genre
            genre: p.genre,
            style: p.style
          }));
          setProjects([...staticProjects, ...formattedCustom]);
        } catch (e) {
          console.error("Error reading custom projects", e);
        }
      }
    }
  }, []);

  const getGradientForGenre = (genre) => {
    switch (genre?.toLowerCase()) {
      case 'romance':
      case 'romance / shojo':
      case 'romance / shōjo':
        return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
      case 'horror':
      case 'horror / thriller':
        return 'linear-gradient(135deg, #130cb7 0%, #52e5e7 100%)';
      case 'fantasy':
      case 'fantasy / isekai':
        return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
      case 'action':
      case 'action / shonen':
      case 'action / shōnen':
        return 'linear-gradient(135deg, #ff8c42 0%, #ff5e62 100%)';
      case 'slice of life':
      case 'slice of life / comedy':
        return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
      default:
        return 'linear-gradient(135deg, #abecd6 0%, #fbed96 100%)';
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{dict?.dashboard?.title}</h1>
        <Link href={`/${locale}/search`} className="btn btn-primary">{dict?.dashboard?.findPartners}</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Messages & Matches Area */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{dict?.dashboard?.recentMatches}</h2>
          {matches.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{m.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.genre}</p>
              </div>
              <div>
                <Link href={`/${locale}/messages`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>{dict?.dashboard?.message}</Link>
              </div>
            </div>
          ))}
        </section>

        {/* Projects Area */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{dict?.dashboard?.activeProjects}</h2>
          {projects.map(p => (
            <Link key={p.id} href={`/${locale}/workspace/${p.id}`} className="project-card-link">
              <div className="project-card">
                <div className="project-card-banner" style={{ 
                  backgroundImage: p.bannerImage ? `url(${p.bannerImage})` : 'none',
                  background: p.bannerImage ? undefined : getGradientForGenre(p.genre),
                  height: '100px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div className="project-card-overlay" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                    <span className="project-card-badge">{p.status}</span>
                    {p.style && (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: 'white', 
                        background: 'rgba(0,0,0,0.4)', 
                        padding: '0.15rem 0.4rem', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {p.style}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="project-card-body">
                  <h3 className="project-card-title">{p.title}</h3>
                  <div className="project-card-meta">
                    <span>{dict?.dashboard?.role || 'Role'}: <strong>{p.role}</strong></span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{p.lastUpdateTime}</span>
                  </div>

                  <div className="project-progress-container">
                    <div className="project-progress-text">
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="project-progress-bar">
                      <div className="project-progress-fill" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="project-card-footer">
                    <span style={{ fontStyle: 'italic', fontSize: '0.75rem', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{p.lastUpdate}"</span>
                    <div className="avatar-group">
                      <div className="avatar-bubble avatar-writer" title="Kenta (Writer)">K</div>
                      <div className="avatar-bubble avatar-illustrator" title="Aoi (Artist)">A</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link href={`/${locale}/workspace/new`} className="btn btn-outline" style={{ display: 'block', width: '100%', marginTop: '1rem', borderStyle: 'dashed', textAlign: 'center' }}>
            {dict?.dashboard?.createProject || '+ Create New Project'}
          </Link>
        </section>
      </div>
    </div>
  );
}
