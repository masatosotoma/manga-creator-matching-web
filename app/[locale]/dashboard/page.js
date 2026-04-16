import Link from 'next/link';
import { getDictionary } from '../../lib/dictionaries';

export default async function Dashboard({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Mock Data
  const matches = [
    { id: 1, name: "Kenta (Writer)", matchStatus: "New", genre: "Fantasy", role: "writer" },
    { id: 2, name: "Aoi (Artist)", matchStatus: "Active", genre: "Anime", role: "illustrator" },
  ];

  const projects = [
    { id: 1, title: "The Last Samurai Apprentice", status: "In Progress", role: "Illustrating" }
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
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>{dict.dashboard.message}</button>
              </div>
            </div>
          ))}
        </section>

        {/* Projects Area */}
        <section style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{dict.dashboard.activeProjects}</h2>
          {projects.map(p => (
            <div key={p.id} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{dict.dashboard.role}: {p.role}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{p.status}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderStyle: 'dashed' }}>
            {dict.dashboard.createProject}
          </button>
        </section>
      </div>
    </div>
  );
}
