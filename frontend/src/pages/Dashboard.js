import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import JobSelector from '../components/JobSelector';
import SkillGapResult from '../components/SkillGapResult';
import { analysisApi, profileApi } from '../services/api';
import { useAuth } from '../store/AuthContext';

const steps = ['Upload Resume', 'Select Role', 'View Results'];

const Dashboard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [resumeData, setResumeData] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedCourses, setCompletedCourses] = useState([]);

  const handleResumeUpload = (data) => {
    setResumeData(data);
    setStep(1);
  };

  const handleAnalyze = async () => {
    if (!resumeData?.resumeId || !jobTitle.trim()) {
      setError('Please upload a resume and select a job role first');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await analysisApi.analyze({ resumeId: resumeData.resumeId, jobTitle });
      setResult(data);
      setStep(2);
      if (user) {
        try {
          const profile = await profileApi.get();
          setCompletedCourses(profile.user?.completedCourses || []);
        } catch {}
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = async (course, isDone) => {
    if (!user) return;
    try {
      if (isDone) {
        await profileApi.removeCourse(course);
        setCompletedCourses(prev => prev.filter(c => c !== course));
      } else {
        await profileApi.completeCourse(course);
        setCompletedCourses(prev => [...prev, course]);
      }
    } catch {}
  };

  const handleReset = () => {
    setStep(0);
    setResumeData(null);
    setJobTitle('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                Skill Gap Mapper
              </h1>
              <p className="text-slate-500 text-sm font-body mt-1">
                {user ? `Welcome back, ${user.name}` : 'Try without an account — sign up to save results'}
              </p>
            </div>
            {result && (
              <button onClick={handleReset} className="ghost-btn text-xs">
                New Analysis
              </button>
            )}
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold
                    transition-all duration-300 ${i < step ? 'bg-acid text-ink-950' : i === step ? 'bg-acid/20 text-acid border border-acid/40' : 'bg-ink-800 text-slate-600 border border-slate-800'}`}>
                    {i < step ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (i + 1)}
                  </div>
                  <span className={`text-xs font-body hidden sm:block ${i === step ? 'text-acid' : 'text-slate-600'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-300 ${i < step ? 'bg-acid/40' : 'bg-slate-800'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-body animate-fade-up">
            {error}
          </div>
        )}

        {/* Step 0: Upload Resume */}
        {step === 0 && (
          <div className="glass-card p-6 animate-fade-up">
            <p className="section-label">Step 1 — Resume Upload</p>
            <ResumeUpload onUploadSuccess={handleResumeUpload} />
          </div>
        )}

        {/* Step 1: Job Selection */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <p className="section-label mb-0">Resume</p>
                <button onClick={() => setStep(0)} className="text-xs text-slate-500 hover:text-acid transition-colors font-body">
                  ← Change
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-ink-900 rounded-xl">
                <div className="w-9 h-9 bg-acid/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-body">{resumeData?.fileName}</p>
                  <p className="text-slate-500 text-xs">{resumeData?.current_skills?.length || 0} skills found</p>
                </div>
              </div>
              {resumeData?.current_skills?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-slate-600 mb-2 font-body">Detected skills preview:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.current_skills.slice(0, 12).map((s, i) => (
                      <span key={i} className="skill-chip-have text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card p-6 animate-fade-up-delay-1">
              <p className="section-label">Step 2 — Select Target Role</p>
              <JobSelector value={jobTitle} onChange={setJobTitle} />
              <button
                onClick={handleAnalyze}
                disabled={!jobTitle.trim() || loading}
                className="acid-btn w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin"></div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Skill Gap
                  </>
                )}
              </button>
              {!user && (
                <p className="text-center text-slate-600 text-xs mt-3 font-body">
                  Results won't be saved — <a href="/register" className="text-acid hover:underline">sign up</a> to track progress
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {step === 2 && result && (
          <SkillGapResult
            result={result}
            completedCourses={completedCourses}
            onCourseToggle={user ? handleCourseToggle : null}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
