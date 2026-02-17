import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, analysisApi } from '../services/api';
import { useAuth } from '../store/AuthContext';
import ProgressChart from '../components/ProgressChart';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [p, h, pr] = await Promise.all([
          profileApi.get(),
          analysisApi.getHistory(),
          analysisApi.getProgress()
        ]);
        setProfile(p);
        setHistory(h);
        setProgress(pr);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-800 border-t-acid rounded-full animate-spin"></div>
    </div>
  );

  const completedCourses = profile?.user?.completedCourses || [];
  const avgMatch = history.length
    ? Math.round(history.reduce((acc, r) => acc + r.skillMatchPercentage, 0) / history.length)
    : 0;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">{user?.name}</h1>
            <p className="text-slate-500 text-sm font-body mt-1">{user?.email}</p>
            <span className={`text-xs font-mono px-2 py-0.5 rounded mt-2 inline-block
              ${user?.role === 'admin' ? 'bg-acid/20 text-acid' : 'bg-ink-900 text-slate-600 border border-slate-800'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="ghost-btn text-xs">
            Sign Out
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Analyses', value: history.length },
            { label: 'Avg Match', value: `${avgMatch}%` },
            { label: 'Courses Done', value: completedCourses.length }
          ].map(stat => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <p className="font-display font-bold text-2xl text-acid">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1 font-body">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ink-900 p-1 rounded-xl mb-6 w-fit">
          {['overview', 'history', 'courses'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-display font-bold capitalize transition-all duration-200
                ${activeTab === tab ? 'bg-ink-800 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-up">
            <div className="glass-card p-6">
              <p className="section-label">Progress Over Time</p>
              <ProgressChart logs={progress} />
            </div>

            {history.length > 0 && (
              <div className="glass-card p-6">
                <p className="section-label">Latest Analysis</p>
                <div className="space-y-3">
                  {history.slice(0, 3).map(r => (
                    <div key={r._id} className="flex items-center gap-4 p-3 bg-ink-900 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-acid/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-acid font-display font-bold text-sm">{r.skillMatchPercentage}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-body truncate">{r.jobTitle}</p>
                        <p className="text-slate-600 text-xs">{new Date(r.analyzedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-red-400 text-xs">{r.missingSkills?.length} missing</p>
                        <p className="text-acid text-xs">{r.currentSkills?.length} matched</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass-card p-6 animate-fade-up">
            <p className="section-label">All Analyses</p>
            {history.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-600 text-sm">No analyses yet</p>
                <button onClick={() => navigate('/dashboard')} className="acid-btn text-xs mt-4">
                  Run First Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(r => {
                  const pct = r.skillMatchPercentage;
                  const color = pct >= 70 ? '#B5FF4D' : pct >= 40 ? '#FFD700' : '#FF6B6B';
                  return (
                    <div key={r._id} className="p-4 bg-ink-900 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-display font-bold text-white text-sm">{r.jobTitle}</p>
                        <span className="font-display font-bold text-sm" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="w-full bg-ink-800 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-body">
                        <span>{r.currentSkills?.length} skills matched</span>
                        <span>·</span>
                        <span>{r.missingSkills?.length} missing</span>
                        <span>·</span>
                        <span>{new Date(r.analyzedAt).toLocaleDateString()}</span>
                      </div>
                      {r.missingSkills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.missingSkills.slice(0, 6).map((s, i) => (
                            <span key={i} className="skill-chip-missing text-xs">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="glass-card p-6 animate-fade-up">
            <p className="section-label">Completed Courses</p>
            {completedCourses.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-600 text-sm">No completed courses yet</p>
                <p className="text-slate-700 text-xs mt-1">Mark courses as done from your analysis results</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedCourses.map((course, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-ink-900 rounded-xl">
                    <div className="w-5 h-5 bg-acid rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-ink-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-300 text-sm font-body">{course}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
