import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const features = [
  { icon: '📄', title: 'Resume Parsing', desc: 'PDF upload with AI-powered text extraction and skill detection' },
  { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Compare your current skills against industry-standard job requirements' },
  { icon: '📊', title: 'Match Score', desc: 'Get a precise percentage of how well you match your target role' },
  { icon: '🚀', title: 'Learning Path', desc: 'Personalized course and project recommendations to close gaps' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Monitor your skill development over time with visual charts' },
  { icon: '🔐', title: 'Secure & Private', desc: 'JWT authentication with encrypted storage for your resume data' },
];

const stats = [
  { value: '12+', label: 'Job Roles' },
  { value: 'AI', label: 'Powered' },
  { value: '∞', label: 'Analyses' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-acid/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-acid/10 border border-acid/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-acid rounded-full animate-pulse"></div>
            <span className="text-acid text-xs font-display font-bold tracking-wider">AI-POWERED SKILL ANALYSIS</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white leading-tight mb-6">
            Know Exactly What<br />
            <span className="text-acid">Skills You're Missing</span>
          </h1>

          <p className="text-slate-400 text-lg font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, select a target role, and get an instant AI analysis of your skill gaps with a personalized learning roadmap.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="acid-btn inline-flex items-center gap-2 justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {user ? 'Go to Dashboard' : 'Start Free Analysis'}
            </Link>
            <Link to="/dashboard" className="ghost-btn inline-flex items-center gap-2 justify-center">
              Try Without Account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="flex justify-center gap-12 mt-16">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-3xl text-acid">{s.value}</p>
                <p className="text-slate-500 text-xs font-body mt-1 tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center">How It Works</p>
          <div className="grid sm:grid-cols-3 gap-8 mt-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF resume and our AI extracts all your skills automatically.' },
              { step: '02', title: 'Select Job Role', desc: 'Pick from 12+ preset roles or enter any custom job title.' },
              { step: '03', title: 'Get Your Roadmap', desc: 'Instantly see missing skills, match score, and personalized learning path.' }
            ].map(item => (
              <div key={item.step} className="glass-card p-6 text-center">
                <p className="font-display font-bold text-5xl text-acid/20 mb-4">{item.step}</p>
                <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center">Features</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {features.map(f => (
              <div key={f.title} className="glass-card p-5 hover:border-acid/20 transition-colors duration-300">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-display font-bold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs font-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to Close Your <span className="text-acid">Skill Gaps?</span>
          </h2>
          <p className="text-slate-500 text-sm font-body mb-8">
            Join thousands of developers and professionals using AI to accelerate their career growth.
          </p>
          <Link to={user ? '/dashboard' : '/register'} className="acid-btn inline-block">
            {user ? 'Analyze My Resume' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
