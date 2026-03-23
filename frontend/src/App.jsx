import { useState, useRef } from 'react';
import './index.css';
import { analyzeCandidates } from './services/api';
import logoImg from '../logo/logo.png';
import { Sparkles, UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target, LayoutDashboard, X, FileIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [rankings, setRankings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const applicationRef = useRef(null);

  const scrollToApp = () => {
    applicationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setResumes([...resumes, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setResumes([...resumes, ...selectedFiles]);
  };

  const removeResume = (index) => {
    const newResumes = [...resumes];
    newResumes.splice(index, 1);
    setResumes(newResumes);
  };

  const analyzeResumes = async () => {
    if (!jobDescription || resumes.length === 0) {
      alert("Please provide both a job description and at least one resume.");
      return;
    }

    setIsLoading(true);
    try {
      // Pass the job description text and the array of File objects
      const results = await analyzeCandidates(jobDescription, resumes);
      
      // Attempt to link back the files to the results for previewing
      // The backend returns them in the order they were processed, but it might sort them.
      // Usually, backend returns a "filename" or similar identifier. If not, we do our best.
      const resultsWithFiles = results.map(result => {
        // Try to find matching file by name. If the backend doesn't send name, this relies on index.
        const matchingFile = resumes.find(f => f.name === result.name) || resumes[0];
        return {
          ...result,
          fileUrl: matchingFile ? URL.createObjectURL(matchingFile) : null,
          fileType: matchingFile ? matchingFile.type : null
        };
      });

      setRankings(resultsWithFiles);
    } catch (error) {
      console.error("Failed to analyze candidates:", error);
      alert("An error occurred while analyzing the candidates. Please make sure the backend server is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 40) return 'Partial Match';
    return 'Weak Match';
  };

  return (
    <>
      <div className="background-mesh"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <a href="#" className="logo">
            <img src={logoImg} alt="NexHire AI Logo" style={{ height: '32px', width: 'auto', borderRadius: '6px' }} />
            <h1 className="text-gradient">NexHire AI</h1>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <button onClick={scrollToApp} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Try App
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Landing Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <Sparkles size={16} /> powered by advanced NLP
          </div>
          <h1>
            Screen Resumes <br />
            <span className="text-gradient">10x Faster with AI</span>
          </h1>
          <p>
            Upload your job description and candidate resumes. Our intelligent engine parses, matches, and ranks the best applicants instantly, eliminating manual screening.
          </p>
          <div className="hero-cta">
            <button onClick={scrollToApp} className="btn-primary">
              Start Screening <ArrowRight size={20} />
            </button>
            <a href="#features" className="btn-secondary">
              View Features
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="text-gradient" style={{ justifyContent: 'center' }}>Why use NexHire?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Stop wasting hours reading through unqualified applicants.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper">
                <Zap className="feature-icon text-gradient" />
              </div>
              <h3>Instant Analysis</h3>
              <p>Process dozens of PDF and DOCX files in seconds. No more reading every single page manually.</p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper">
                <Target className="feature-icon text-gradient" />
              </div>
              <h3>Smart Matching</h3>
              <p>Our NLP models detect semantic similarities, not just keyword matches, to uncover true underlying skills.</p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper">
                <LayoutDashboard className="feature-icon text-gradient" />
              </div>
              <h3>Actionable Results</h3>
              <p>View ranked candidates immediately with clear visual indicators of matched and missing technical requirements.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works container" style={{ padding: '6rem 0', position: 'relative' }}>
          <h2 className="text-gradient">How NexHire Works</h2>
          <div className="steps-container" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="step-card glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
              <div className="step-number" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>1</div>
              <h3>Define Role</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Paste the detailed job description and key requirements for the position.</p>
            </div>
            <div className="step-card glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
              <div className="step-number" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>2</div>
              <h3>Upload Resumes</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Drag and drop all applicant resumes in bulk (PDF or DOCX format).</p>
            </div>
            <div className="step-card glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
              <div className="step-number" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>3</div>
              <h3>AI Analysis</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Our system compares the candidates against the role using advanced NLP.</p>
            </div>
            <div className="step-card glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
              <div className="step-number" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>4</div>
              <h3>Hire the Best</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Review the ranked dashboard and contact your perfect match instantly.</p>
            </div>
          </div>
        </section>

        {/* Core Application Interface */}
        <section ref={applicationRef} id="app" className="app-section container">
          <h2 className="text-gradient" style={{ marginBottom: '3rem' }}>Screen Candidates Now</h2>

          <div className="tool-container">
            <div className="tool-grid">

              {/* Job Description Input */}
              <div className="glass-panel" style={{ height: '100%' }}>
                <div className="input-header">
                  <FileText className="text-gradient" size={24} />
                  <h3>Job Description</h3>
                </div>
                <textarea
                  placeholder="Paste the job description, required skills, and responsibilities here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="job-input"
                />
              </div>

              {/* Resume Upload Area */}
              <div className="glass-panel" style={{ height: '100%' }}>
                <div className="input-header">
                  <UploadCloud className="text-gradient" size={24} />
                  <h3>Candidate Resumes</h3>
                </div>

                <div
                  className={`drop-zone ${isHovering ? 'hovering' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="drop-content">
                    <UploadCloud className="upload-icon pulse" size={48} />
                    <p>Drag & Drop resumes here</p>
                    <span className="divider">or</span>
                    <label className="file-label btn-secondary">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden-input"
                      />
                    </label>
                  </div>
                </div>

                {/* File List */}
                {resumes.length > 0 && (
                  <div className="file-list fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4>Uploaded Files ({resumes.length})</h4>
                      <button onClick={() => setResumes([])} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All</button>
                    </div>
                    <ul className="resume-items">
                      {resumes.map((file, index) => (
                        <li key={index} className="resume-item glass-panel-small">
                          <div className="file-info">
                            <FileIcon className="text-secondary" size={16} />
                            <span className="file-name">{file.name}</span>
                          </div>
                          <button onClick={() => removeResume(index)} className="remove-btn" title="Remove">
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <div className="action-center">
              <button
                className={`btn-primary analyze-btn ${isLoading ? 'loading' : ''}`}
                onClick={analyzeResumes}
                disabled={isLoading || !jobDescription || resumes.length === 0}
              >
                {isLoading ? (
                  <>Processing candidates with AI...</>
                ) : (
                  <>
                    <Target size={20} />
                    Rank Candidates
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {rankings && (
              <div className="results-section">
                <h2 className="text-gradient" style={{ marginTop: '2rem', marginBottom: '2rem' }}>Candidate Dashboard</h2>

                {/* Comparison Bar Chart */}
                <div className="glass-panel fade-in" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Candidate Score Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[...rankings].sort((a, b) => b.score - a.score)} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} formatter={(value) => [`${value}/100`, 'Score']} />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {[...rankings].sort((a, b) => b.score - a.score).map((entry, index) => (
                          <Cell key={index} fill={getScoreColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>● Strong Match (70+)</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>● Partial Match (40-69)</span>
                    <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>● Weak Match (below 40)</span>
                  </div>
                </div>

                <div className="rankings-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
                  {rankings.map((candidate, index) => (
                    <div key={candidate.id || index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      {/* Score Card */}
                      <div className="candidate-card glass-panel fade-in" style={{ animationDelay: `${index * 0.1}s`, height: '100%' }}>
                        <div className="card-header">
                          <div className="candidate-info">
                            <span className="rank-badge">#{index + 1}</span>
                            <h3 className="candidate-name">{candidate.name || `Candidate ${index + 1}`}</h3>
                          </div>
                          <div className="score-badge glass-panel-small" style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'block', color: getScoreColor(candidate.score) }}>{candidate.score}/100</div>
                            <div style={{ fontSize: '0.75rem', color: getScoreColor(candidate.score) }}>{getScoreLabel(candidate.score)}</div>
                          </div>
                        </div>
                        {/* Score Progress Bar */}
                        <div style={{ margin: '0.75rem 0', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${candidate.score}%`, height: '100%', background: getScoreColor(candidate.score), borderRadius: '999px', transition: 'width 1s ease' }} />
                        </div>

                        <div className="skills-analysis">
                          <div className="skills-group">
                            <h4><CheckCircle2 size={16} className="text-success" /> Matched Skills</h4>
                            <div className="tags">
                              {candidate.matches && candidate.matches.length > 0 ? candidate.matches.map((skill, i) => (
                                <span key={i} className="tag tag-success">{skill}</span>
                              )) : <span className="text-secondary" style={{ fontSize: '0.85rem' }}>No direct skill matches found.</span>}
                            </div>
                          </div>

                          {candidate.missing && candidate.missing.length > 0 && (
                            <div className="skills-group">
                              <h4><AlertTriangle size={16} className="text-warning" /> Missing Requirements</h4>
                              <div className="tags">
                                {candidate.missing.map((skill, i) => (
                                  <span key={i} className="tag tag-warning">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Document Preview Layout (The blank space) */}
                      <div className="glass-panel fade-in" style={{ animationDelay: `${(index * 0.1) + 0.1}s`, height: '500px', display: 'flex', flexDirection: 'column' }}>
                         <div className="input-header" style={{ marginBottom: '1rem' }}>
                          <FileText className="text-gradient" size={20} />
                          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Resume Preview</h4>
                        </div>
                        {candidate.fileUrl ? (
                          candidate.fileType === 'application/pdf' ? (
                            <iframe 
                              src={candidate.fileUrl} 
                              title={`Resume Preview ${index}`}
                              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', backgroundColor: 'white' }}
                            />
                          ) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                               <FileIcon size={48} className="text-secondary" />
                               <p className="text-secondary" style={{ textAlign: 'center', padding: '0 1rem' }}>
                                 Preview is only available for PDF files.<br />
                                 <span style={{ fontSize: '0.85rem' }}>{candidate.name} is a non-PDF document.</span>
                               </p>
                            </div>
                          )
                        ) : (
                           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                              Preview not available
                           </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Contact Section */}
      <section id="contact" className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Get in Touch</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Have questions about NexHire AI or want to request a custom enterprise integration? Reach out to our team.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          <div className="glass-panel" style={{ flex: '1', minWidth: '250px', maxWidth: '350px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact Info</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#60a5fa' }}><Sparkles size={18} /></div>
                <span>hello@nexhire-ai.com</span>
              </li>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#60a5fa' }}><Sparkles size={18} /></div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#60a5fa' }}><Sparkles size={18} /></div>
                <span>123 Innovation Drive,<br />Tech City, TC 94016</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>

          <div className="footer-brand">
            <div className="footer-logo" style={{ marginBottom: '1rem', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={logoImg} alt="NexHire AI Logo" style={{ height: '28px', width: 'auto', borderRadius: '4px' }} />
              <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>NexHire AI</span>
            </div>
            <p className="footer-text" style={{ maxWidth: '300px' }}>
              Transforming the recruitment process through intelligent parsing, semantic matching, and automated candidate ranking.
            </p>
          </div>

          <div className="footer-links">
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="#features" className="nav-link" style={{ padding: 0 }}>Features</a></li>
              <li><a href="#how-it-works" className="nav-link" style={{ padding: 0 }}>How it Works</a></li>
              <li><a href="#app" className="nav-link" style={{ padding: 0 }}>Try the App</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>Email:</span> hello@nexhire-ai.com
              </li>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>Phone:</span> +1 (555) 123-4567
              </li>
              <li style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>Address:</span> 123 Innovation Drive, Tech City, TC 94016
              </li>
            </ul>
          </div>

        </div>
        <div className="container" style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <p className="footer-text">© 2026 NexHire AI Resume Screening. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
