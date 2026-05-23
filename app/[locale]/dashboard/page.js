import Link from 'next/link';
import { getDictionary } from '../../../lib/dictionaries';

export default async function Dashboard({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Mock Data
  const matches = [
    { id: 1, name: "Kenta (Writer)", matchStatus: "New", genre: "Fantasy", role: "writer" },
    { id: 2, name: "Aoi (Artist)", matchStatus: "Active", genre: "Anime", role: "illustrator" },
  ];

  const projects = [
    { 
      id: 1, 
      title: "The Last Samurai Apprentice", 
      status: "In Progress", 
      role: "Illustrating",
      progress: 65,
      lastUpdate: "Aoi uploaded Chapter 1 sketches",
      lastUpdateTime: "2h ago",
      bannerImage: "/images/samurai_concept.png"
    }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{dict.dashboard.title}</h1>
        <Link href={`/${locale}/search`} className="btn btn-primary">{dict.dashboard.findPartners}</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Messages & Matches Area */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{dict.dashboard.recentMatches}</h2>
          {matches.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{m.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.genre}</p>
              </div>
              <div>
                <Link href={`/${locale}/messages`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>{dict.dashboard.message}</Link>
              </div>
            </div>
          ))}
        </section>

        {/* Projects Area */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{dict.dashboard.activeProjects}</h2>
          {projects.map(p => (
            <Link key={p.id} href={`/${locale}/workspace/${p.id}`} className="project-card-link">
              <div className="project-card">
                <div className="project-card-banner" style={{ backgroundImage: `url(${p.bannerImage})` }}>
                  <div className="project-card-overlay">
                    <span className="project-card-badge">{p.status}</span>
                  </div>
                </div>
                
                <div className="project-card-body">
                  <h3 className="project-card-title">{p.title}</h3>
                  <div className="project-card-meta">
                    <span>{dict.dashboard.role}: <strong>{p.role}</strong></span>
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
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderStyle: 'dashed' }}>
            {dict.dashboard.createProject}
          </button>
        </section>
      </div>
    </div>
  );
}
