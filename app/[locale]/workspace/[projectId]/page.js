"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '../../../../components/TranslationProvider';

export default function Workspace() {
  const dict = useTranslation();
  const params = useParams();
  const router = useRouter();
  
  const locale = params?.locale || 'en';
  const projectId = 'PROJECT-' + (params?.projectId || '1');

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('creative'); // 'creative' | 'pipeline' | 'chat'
  const [projectStatus, setProjectStatus] = useState('Storyboarding');
  const [selectedChapter, setSelectedChapter] = useState(1);
  
  // Scripts state
  const [scriptContent, setScriptContent] = useState({
    title: "Chapter 1 - The Meeting",
    text: `[PANEL 1]
KOJIRO: (Looking at the training blade) "Master... Is this truly the legendary bamboo shinai? It looks... ordinary."
ACTION: Kojiro lifts the heavy wooden blade, dust particles catching the golden sunbeams in the old dojo.

[PANEL 2]
MASTER SADA: "It is not the steel that makes the samurai, Kojiro. It is the unbreakable spirit of the wielder."
ACTION: The old Master stands silhouetted against the sliding shoji door, cherry blossoms drifting outside.

[PANEL 3]
KOJIRO: "I will make you proud. I will defeat the Kurogane clan!"
ACTION: Kojiro grips the hilt, eyes blazing with newfound resolve.`,
    notes: "Need to make the Master's expression softer in Panel 2. Make sure Kojiro's grip looks firm."
  });

  const [scriptNotesInput, setScriptNotesInput] = useState(scriptContent.notes);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptText, setNewScriptText] = useState('');

  // Art Assets state
  const [selectedArtTab, setSelectedArtTab] = useState('storyboard'); // 'storyboard' | 'character' | 'keyart'
  const [pinMode, setPinMode] = useState(false);
  const [pins, setPins] = useState([
    { id: 1, x: 45, y: 35, note: "Let's increase the contrast of the cherry blossoms here", creator: "Kenta (Writer)", resolved: false },
    { id: 2, x: 75, y: 68, note: "Kojiro's eyes need to be more fiery", creator: "Aoi (Artist)", resolved: false }
  ]);
  const [activePinId, setActivePinId] = useState(null);
  const [newPinNote, setNewPinNote] = useState('');
  const [tempPin, setTempPin] = useState(null);
  const imageRef = useRef(null);

  // Milestone Pipeline state
  const [milestones, setMilestones] = useState([
    { id: 1, name: "Project Concept & Outline", status: "completed", description: "Establish main characters, world lore, and core narrative arcs.", date: "Completed May 10, 2026", checklist: ["Character backstories", "Worldbuilding sheet", "Target genre alignment"] },
    { id: 2, name: "Chapter 1 Scripting", status: "completed", description: "First draft of the screenplay, panel directions, and dialogue.", date: "Completed May 15, 2026", checklist: ["Dialogue polish", "Action annotations", "Novelist draft approval"] },
    { id: 3, name: "Chapter 1 Storyboarding", status: "current", description: "Rough draft panel layout, initial posing, and screen flow sketches.", date: "Started May 18, 2026", checklist: ["Thumbnail panels", "Visual flow check", "Writer feedback loop"] },
    { id: 4, name: "Inking & Clean Lineart", status: "upcoming", description: "Tracing final clean lines over storyboards.", date: "Est. June 1, 2026", checklist: ["Clean outline", "Foreground focus", "Ink weight consistency"] },
    { id: 5, name: "Coloring & Screentones", status: "upcoming", description: "Adding manga screentones or colored gradients.", date: "Est. June 10, 2026", checklist: ["Atmospheric lighting", "Screentone shading", "Sound effect lettering"] },
    { id: 6, name: "Publication & Pitching", status: "upcoming", description: "Final proofreading, stitching, and pushing to the public gallery.", date: "Est. June 20, 2026", checklist: ["Stitch panels vertically", "Metadata preparation", "Post to MangaCollab Gallery"] }
  ]);

  // Chat/Collaboration state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Aoi (Artist)', tag: 'Illustrator', text: dict.workspace.initMsg || "I uploaded the initial character sketches for Chapter 1!", time: '10:00 AM', reactions: { '🔥': 2, '❤️': 1 } },
    { id: 2, sender: 'Kenta (Writer)', tag: 'Novelist', text: "They look absolutely legendary, Aoi! The posture of Kojiro is exactly how I imagined it.", time: '10:05 AM', reactions: { '👍': 1 } },
    { id: 3, sender: 'Aoi (Artist)', tag: 'Illustrator', text: "Thanks! I'm starting on the page panel layouts now. Feel free to leave comments on the storyboards using the Feedback Pins!", time: '10:15 AM', reactions: {} }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  // --- ACTIONS ---

  // Handle Script updates
  const handleSaveNotes = () => {
    setScriptContent({ ...scriptContent, notes: scriptNotesInput });
    alert("Script notes updated successfully!");
  };

  const handleUploadScriptSubmit = (e) => {
    e.preventDefault();
    if (!newScriptTitle || !newScriptText) return;
    setScriptContent({
      title: newScriptTitle,
      text: newScriptText,
      notes: "Newly uploaded script draft."
    });
    setScriptNotesInput("Newly uploaded script draft.");
    setShowScriptModal(false);
    setNewScriptTitle('');
    setNewScriptText('');
  };

  // Handle visual feedback pins
  const handleCanvasClick = (e) => {
    if (!pinMode) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempPin({ x, y });
  };

  const handleAddPin = (e) => {
    e.preventDefault();
    if (!newPinNote || !tempPin) return;
    const newPin = {
      id: Date.now(),
      x: tempPin.x,
      y: tempPin.y,
      note: newPinNote,
      creator: "Kenta (Writer)",
      resolved: false
    };
    setPins([...pins, newPin]);
    setNewPinNote('');
    setTempPin(null);
    setPinMode(false);
  };

  const handleResolvePin = (id) => {
    setPins(pins.map(p => p.id === id ? { ...p, resolved: true } : p));
    setActivePinId(null);
  };

  const handleRemovePin = (id) => {
    setPins(pins.filter(p => p.id !== id));
    setActivePinId(null);
  };

  // Handle Chat messaging
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Kenta (Writer)',
      tag: 'Novelist',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  const handleAddReaction = (msgId, emoji) => {
    setChatMessages(chatMessages.map(msg => {
      if (msg.id !== msgId) return msg;
      const count = msg.reactions[emoji] || 0;
      return {
        ...msg,
        reactions: {
          ...msg.reactions,
          [emoji]: count + 1
        }
      };
    }));
  };

  const handleMilestoneClick = (id) => {
    setMilestones(milestones.map(m => {
      if (m.id === id) {
        let newStatus = m.status === 'completed' ? 'current' : m.status === 'current' ? 'upcoming' : 'completed';
        if (newStatus === 'current') setProjectStatus(m.name);
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href={`/${locale}/dashboard`} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
              ← Back to Dashboard
            </Link>
            <span style={{ fontSize: '0.8rem', background: 'rgba(255, 140, 66, 0.1)', color: 'var(--primary)', padding: '0.15rem 0.5rem', borderRadius: '99px', fontWeight: 700 }}>
              {projectId}
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.25rem 0' }}>{dict.workspace.demoTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <strong>{dict.workspace.team}:</strong> Kenta (Writer) & Aoi (Illustrator)
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="avatar-bubble avatar-writer">K</span>
              <span className="avatar-bubble avatar-illustrator">A</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Project Phase</span>
            <select 
              value={projectStatus} 
              onChange={(e) => setProjectStatus(e.target.value)}
              className="workspace-input"
              style={{ padding: '0.4rem 1.5rem 0.4rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="Concept">Concept Draft</option>
              <option value="Scriptwriting">Scriptwriting</option>
              <option value="Storyboarding">Storyboarding</option>
              <option value="Inking">Inking & Lineart</option>
              <option value="Finished">Final Polish</option>
            </select>
          </div>
          <a href={`/${locale}/publish`} className="btn btn-primary" style={{ background: '#28a745', boxShadow: '0 4px 14px rgba(40, 167, 69, 0.25)', height: 'fit-content' }}>
            🚀 {dict.workspace.publishButton}
          </a>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="workspace-tabs">
        <button 
          onClick={() => setActiveTab('creative')}
          className={`workspace-tab ${activeTab === 'creative' ? 'active' : ''}`}
        >
          📝 Creative Board
        </button>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`workspace-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
        >
          📈 Production Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`workspace-tab ${activeTab === 'chat' ? 'active' : ''}`}
        >
          💬 Chat & Brainstorming
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* --- TAB 1: CREATIVE BOARD --- */}
      {activeTab === 'creative' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
          
          {/* LEFT PANE: SCRIPT & LORE */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '720px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📝 Scripts & Lore</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setSelectedChapter(1)}
                  className="btn btn-outline" 
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', background: selectedChapter === 1 ? 'var(--primary)' : 'transparent', color: selectedChapter === 1 ? 'white' : 'var(--primary)' }}
                >
                  Ch 1
                </button>
                <button 
                  onClick={() => setSelectedChapter(2)}
                  className="btn btn-outline" 
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', background: selectedChapter === 2 ? 'var(--primary)' : 'transparent', color: selectedChapter === 2 ? 'white' : 'var(--primary)' }}
                >
                  Ch 2 (Draft)
                </button>
              </div>
            </div>

            {selectedChapter === 1 ? (
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{scriptContent.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last updated 2 days ago</span>
                  </div>
                  <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: '1.7', overflowY: 'auto', maxHeight: '350px' }}>
                    {scriptContent.text}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>Collaborative Script Notes</label>
                  <textarea 
                    value={scriptNotesInput}
                    onChange={(e) => setScriptNotesInput(e.target.value)}
                    style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '8px', minHeight: '80px', outline: 'none', resize: 'vertical' }}
                    placeholder="Enter script review notes..."
                  />
                  <button 
                    onClick={handleSaveNotes}
                    className="btn btn-primary" 
                    style={{ alignSelf: 'flex-end', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Save Notes
                  </button>
                </div>

                <button 
                  onClick={() => setShowScriptModal(true)}
                  className="btn btn-outline" 
                  style={{ width: '100%', borderStyle: 'dashed' }}
                >
                  + Upload New Script Draft
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>🔒</span>
                <h3 style={{ fontWeight: 700 }}>Chapter 2 is Draft-Only</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The script is locked by the Novelist until Chapter 1 reaches the lineart phase.</p>
                <button onClick={() => setSelectedChapter(1)} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>View Chapter 1</button>
              </div>
            )}
          </section>

          {/* RIGHT PANE: ART storyboards & canvas */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '720px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🎨 Art & Storyboards</h2>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  onClick={() => { setSelectedArtTab('storyboard'); setTempPin(null); }}
                  className={`btn ${selectedArtTab === 'storyboard' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  Storyboard
                </button>
                <button 
                  onClick={() => { setSelectedArtTab('character'); setTempPin(null); }}
                  className={`btn ${selectedArtTab === 'character' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  Sketches
                </button>
                <button 
                  onClick={() => { setSelectedArtTab('keyart'); setTempPin(null); }}
                  className={`btn ${selectedArtTab === 'keyart' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  Cover Concept
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {selectedArtTab === 'storyboard' && "Chapter 1 Rough Layout Draft"}
                  {selectedArtTab === 'character' && "Kojiro Main Character Sheet"}
                  {selectedArtTab === 'keyart' && "Project Promotional Art Concept"}
                </span>
                <button 
                  onClick={() => { setPinMode(!pinMode); setTempPin(null); }}
                  className="btn"
                  style={{ 
                    padding: '0.3rem 0.75rem', 
                    fontSize: '0.8rem', 
                    background: pinMode ? 'rgba(255,140,66,0.1)' : 'transparent',
                    color: pinMode ? 'var(--primary)' : 'var(--text-muted)',
                    border: pinMode ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    fontWeight: 700
                  }}
                >
                  {pinMode ? "🛑 Pin Mode Active (Click Image)" : "📌 Add Visual Comment Pin"}
                </button>
              </div>

              {/* CANVAS WRAPPER */}
              <div className="storyboard-container" onClick={handleCanvasClick}>
                {/* Visual rendering of art asset */}
                {selectedArtTab === 'storyboard' && (
                  <img 
                    ref={imageRef}
                    src="/images/samurai_storyboard.png" 
                    alt="Manga Storyboard" 
                    style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                  />
                )}
                {selectedArtTab === 'character' && (
                  <img 
                    ref={imageRef}
                    src="/images/samurai_sketch.png" 
                    alt="Character Sheet Sketch" 
                    style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                  />
                )}
                {selectedArtTab === 'keyart' && (
                  <img 
                    ref={imageRef}
                    src="/images/samurai_concept.png" 
                    alt="Cover Concept Art" 
                    style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                  />
                )}

                {/* RENDER ACTIVE PINS ON STORYBOARD ONLY */}
                {selectedArtTab === 'storyboard' && pins.filter(p => !p.resolved).map((p, index) => (
                  <div 
                    key={p.id}
                    className="feedback-pin"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    onClick={(e) => { e.stopPropagation(); setActivePinId(activePinId === p.id ? null : p.id); }}
                  >
                    {index + 1}
                  </div>
                ))}

                {/* PIN ADD MODAL OVERLAY */}
                {tempPin && (
                  <div 
                    className="feedback-pin"
                    style={{ left: `${tempPin.x}%`, top: `${tempPin.y}%`, background: '#28a745', cursor: 'default' }}
                  >
                    +
                  </div>
                )}
              </div>

              {/* FLOATING DIALOGS */}
              {tempPin && (
                <form onSubmit={handleAddPin} style={{ marginTop: '1rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#28a745' }}>📍 Placing visual note at ({Math.round(tempPin.x)}%, {Math.round(tempPin.y)}%)</span>
                  <input 
                    type="text" 
                    value={newPinNote} 
                    onChange={(e) => setNewPinNote(e.target.value)} 
                    placeholder="Describe feedback for this panel element..." 
                    className="workspace-input"
                    required
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setTempPin(null)} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#28a745' }}>Add Pin</button>
                  </div>
                </form>
              )}

              {/* RENDER PIN LIST / TOOLTIPS */}
              {activePinId && (
                (() => {
                  const targetPin = pins.find(p => p.id === activePinId);
                  if (!targetPin) return null;
                  return (
                    <div style={{ marginTop: '1rem', background: 'rgba(255, 140, 66, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>📌 FEEDBACK PIN BY {targetPin.creator.toUpperCase()}</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{targetPin.note}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleResolvePin(targetPin.id)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#28a745' }}>Resolve</button>
                        <button onClick={() => handleRemovePin(targetPin.id)} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderColor: '#dc3545', color: '#dc3545' }}>Delete</button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* ART FILES LIST */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Uploaded Version History:</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>samurai_storyboard_v1.png</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Aoi (Artist) • 4 hours ago</p>
                </div>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Active</span>
              </div>
              <button className="btn btn-outline" style={{ width: '100%', borderStyle: 'dashed', color: '#4a90e2', borderColor: '#4a90e2' }}>
                + {dict.workspace.uploadArt}
              </button>
            </div>

          </section>
        </div>
      )}

      {/* --- TAB 2: MILESTONE PIPELINE TRACKER --- */}
      {activeTab === 'pipeline' && (
        <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📈 Manga Production Pipeline</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track chapter development step-by-step. Click a phase to update its completion status.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {milestones.map((m, idx) => (
              <div 
                key={m.id} 
                onClick={() => handleMilestoneClick(m.id)}
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  background: m.status === 'completed' ? 'rgba(40, 167, 69, 0.05)' : m.status === 'current' ? 'rgba(255, 140, 66, 0.05)' : 'var(--bg-color)',
                  border: m.status === 'completed' ? '1px solid #28a745' : m.status === 'current' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {/* Phase Number bubble */}
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '99px', 
                  background: m.status === 'completed' ? '#28a745' : m.status === 'current' ? 'var(--primary)' : 'var(--border-color)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {m.status === 'completed' ? '✓' : idx + 1}
                </div>

                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  color: m.status === 'completed' ? '#28a745' : m.status === 'current' ? 'var(--primary)' : 'var(--text-muted)'
                }}>
                  {m.status.toUpperCase()}
                </span>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.25rem 0 0.5rem 0' }}>{m.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{m.description}</p>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>Tasks Checklist:</p>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {m.checklist.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <p style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{m.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB 3: DISCUSSION & COLLABORATION SCRAPBOOK --- */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* LEFT COLUMN: COLLABORATION DISCUSSION CHAT */}
          <section style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '620px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>💬 {dict.workspace.chatTitle || "Project Discussion"}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Private team collab channel</p>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 600 }}>🟢 2 online</span>
            </div>
            
            {/* Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chatMessages.map((m) => (
                <div key={m.id} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.sender.includes('Kenta') ? 'flex-end' : 'flex-start', maxWidth: '85%', flexDirection: m.sender.includes('Kenta') ? 'row-reverse' : 'row' }}>
                  
                  {/* Small Avatar bubble */}
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '99px', 
                    background: m.sender.includes('Kenta') ? '#3b82f6' : '#ec4899', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify-content: 'center', 
                    fontWeight: 700, 
                    fontSize: '0.85rem' 
                  }}>
                    {m.sender.includes('Kenta') ? 'K' : 'A'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: m.sender.includes('Kenta') ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700 }}>{m.sender}</span>
                      <span style={{ background: m.tag === 'Novelist' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)', color: m.tag === 'Novelist' ? '#3b82f6' : '#ec4899', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>{m.tag}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{m.time}</span>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', background: m.sender.includes('Kenta') ? 'rgba(255,140,66,0.1)' : 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: m.sender.includes('Kenta') ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {m.text}
                    </div>

                    {/* Emoji Reactions display */}
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                      {Object.entries(m.reactions).map(([emoji, count]) => (
                        <button 
                          key={emoji}
                          onClick={() => handleAddReaction(m.id, emoji)}
                          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.15rem 0.35rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <span>{emoji}</span>
                          <span style={{ fontWeight: 700 }}>{count}</span>
                        </button>
                      ))}
                      
                      {/* Emoji Quick Picker */}
                      <div style={{ display: 'flex', gap: '0.1rem', opacity: 0.5, transition: 'opacity 0.2s' }} className="reaction-picker">
                        {['👍', '🔥', '❤️', '😮'].map(emoji => (
                          <button 
                            key={emoji} 
                            onClick={() => handleAddReaction(m.id, emoji)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0.1rem' }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Form */}
            <form onSubmit={sendChatMessage} style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)', display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder={dict.workspace.typeMessage || "Type team message..."} 
                className="workspace-input"
                style={{ flex: 1, borderRadius: '99px' }} 
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>{dict.workspace.send || "Send"}</button>
            </form>
          </section>

          {/* RIGHT COLUMN: WORKSPACE SCRAPBOOK & Lore wiki */}
          <section style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '620px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>📖 Project Scrapbook & Wiki</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>👤 Character Profiles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <p><strong>Kojiro (Protagonist):</strong> The master's grandson. Hot-headed, determined, has visual key motif of cherry blossom scar on right cheek. Inherits the sacred bamboo sword.</p>
                  <p style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}><strong>Master Sada (Mentor):</strong> Wise, quiet dojo instructor. Always silhouetted or half-shadowed to evoke enigma.</p>
                </div>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>🎨 Artistic Style Sheet Guidelines</h4>
                <ul style={{ fontSize: '0.85rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li><strong>Tonal mood:</strong> High-contrast black ink, screen tones used purely for night scenes or shadow depths.</li>
                  <li><strong>Paneling:</strong> Slanted kinetic gutters during fight scenes; thick square panels for master's dialogue moments.</li>
                  <li><strong>Character outlines:</strong> 0.8mm ink brushes for outlines; finer 0.3mm for clothing folds.</li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>📅 Collaboration Deadlines</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Chapter 1 Layout Draft:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>May 25, 2026 (In 2 days)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  <span>Chapter 1 Ink & screentones:</span>
                  <span>June 8, 2026</span>
                </div>
              </div>

            </div>
          </section>

        </div>
      )}

      {/* --- MODAL DIALOGS --- */}

      {/* Script Upload draft Simulation Modal */}
      {showScriptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form 
            onSubmit={handleUploadScriptSubmit}
            style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '90%', maxWidth: '550px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>📝 Upload New Script Draft</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Script Draft Title</label>
              <input 
                type="text" 
                value={newScriptTitle}
                onChange={(e) => setNewScriptTitle(e.target.value)}
                placeholder="e.g. Chapter 1 - The Meeting (Final Draft)" 
                className="workspace-input"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Script Text Content</label>
              <textarea 
                value={newScriptText}
                onChange={(e) => setNewScriptText(e.target.value)}
                placeholder="Paste script content / screenplay directions here..." 
                className="workspace-input"
                style={{ minHeight: '180px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowScriptModal(false)} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Upload Script</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
