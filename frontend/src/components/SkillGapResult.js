import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const MatchGauge = ({ percentage }) => {
  const color = percentage >= 70 ? '#B5FF4D' : percentage >= 40 ? '#FFD700' : '#FF6B6B';
  const data = [{ value: percentage, fill: color }];

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={180} height={180}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.05)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl" style={{ color }}>{percentage}%</span>
        <span className="text-slate-500 text-xs font-body mt-1">match</span>
      </div>
    </div>
  );
};

const SkillGapResult = ({ result, completedCourses = [], onCourseToggle }) => {
  if (!result) return null;

  const { job_title, current_skills, missing_skills, skill_match_percentage, recommended_courses, recommended_projects } = result;

  const matchLabel = skill_match_percentage >= 70 ? 'Strong Match' : skill_match_percentage >= 40 ? 'Developing' : 'Needs Work';
  const matchColor = skill_match_percentage >= 70 ? 'text-acid' : skill_match_percentage >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <MatchGauge percentage={skill_match_percentage} />
          <div className="flex-1 text-center sm:text-left">
            <p className="section-label">Target Role</p>
            <h2 className="font-display font-bold text-2xl text-white mb-1">{job_title}</h2>
            <span className={`font-display font-bold text-lg ${matchColor}`}>{matchLabel}</span>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-ink-900 rounded-xl p-3 text-center">
                <p className="font-display font-bold text-acid text-xl">{current_skills?.length || 0}</p>
                <p className="text-slate-500 text-xs mt-0.5">Current</p>
              </div>
              <div className="bg-ink-900 rounded-xl p-3 text-center">
                <p className="font-display font-bold text-red-400 text-xl">{missing_skills?.length || 0}</p>
                <p className="text-slate-500 text-xs mt-0.5">Missing</p>
              </div>
              <div className="bg-ink-900 rounded-xl p-3 text-center">
                <p className="font-display font-bold text-cyan-400 text-xl">{recommended_courses?.length || 0}</p>
                <p className="text-slate-500 text-xs mt-0.5">Resources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Skills */}
        <div className="glass-card p-6 animate-fade-up-delay-1">
          <p className="section-label">Skills You Have</p>
          <div className="flex flex-wrap gap-2">
            {current_skills?.length > 0 ? (
              current_skills.map((skill, i) => (
                <span key={i} className="skill-chip-have">{skill}</span>
              ))
            ) : (
              <p className="text-slate-600 text-sm">No skills detected</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-card p-6 animate-fade-up-delay-2">
          <p className="section-label">Skills to Acquire</p>
          <div className="flex flex-wrap gap-2">
            {missing_skills?.length > 0 ? (
              missing_skills.map((skill, i) => (
                <span key={i} className="skill-chip-missing">{skill}</span>
              ))
            ) : (
              <div className="flex items-center gap-2 text-acid text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You have all required skills!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      {recommended_courses?.length > 0 && (
        <div className="glass-card p-6 animate-fade-up-delay-3">
          <p className="section-label">Learning Path</p>
          <div className="space-y-3">
            {recommended_courses.map((course, i) => {
              const isDone = completedCourses.includes(course);
              return (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                  ${isDone ? 'bg-acid/5 border border-acid/20' : 'bg-ink-900 hover:bg-ink-800'}`}>
                  <button
                    onClick={() => onCourseToggle?.(course, isDone)}
                    className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200
                      ${isDone ? 'bg-acid border-acid' : 'border-slate-600 hover:border-acid/60'}`}
                  >
                    {isDone && (
                      <svg className="w-3.5 h-3.5 text-ink-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-body leading-snug ${isDone ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {course}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink-950 text-slate-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Projects */}
      {recommended_projects?.length > 0 && (
        <div className="glass-card p-6 animate-fade-up-delay-4">
          <p className="section-label">Projects to Build</p>
          <div className="space-y-3">
            {recommended_projects.map((project, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-ink-900">
                <div className="w-7 h-7 rounded-lg bg-acid/10 border border-acid/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-acid text-xs font-display font-bold">{i + 1}</span>
                </div>
                <p className="text-slate-300 text-sm font-body leading-relaxed">{project}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapResult;
