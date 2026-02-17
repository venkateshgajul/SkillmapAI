import React, { useState, useEffect } from 'react';
import { analysisApi } from '../services/api';

const JobSelector = ({ value, onChange }) => {
  const [jobs, setJobs] = useState([]);
  const [mode, setMode] = useState('preset');
  const [customJob, setCustomJob] = useState('');

  useEffect(() => {
    analysisApi.getJobs().then(data => setJobs(data.jobs || [])).catch(() => {});
  }, []);

  const handlePresetSelect = (job) => {
    onChange(job);
  };

  const handleCustomChange = (e) => {
    setCustomJob(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('preset'); if (customJob) onChange(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-display font-bold transition-all duration-200
            ${mode === 'preset' ? 'bg-acid text-ink-950' : 'bg-ink-900 text-slate-500 hover:text-white border border-slate-800'}`}
        >
          Preset Roles
        </button>
        <button
          onClick={() => { setMode('custom'); handlePresetSelect(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-display font-bold transition-all duration-200
            ${mode === 'custom' ? 'bg-acid text-ink-950' : 'bg-ink-900 text-slate-500 hover:text-white border border-slate-800'}`}
        >
          Custom Role
        </button>
      </div>

      {mode === 'preset' ? (
        <div className="grid grid-cols-2 gap-2">
          {jobs.map((job) => (
            <button
              key={job}
              onClick={() => handlePresetSelect(job)}
              className={`p-3 rounded-xl text-left text-sm font-body transition-all duration-200 border
                ${value === job
                  ? 'bg-acid/10 border-acid/40 text-acid'
                  : 'bg-ink-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
            >
              {job}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={customJob}
            onChange={handleCustomChange}
            placeholder="e.g. iOS Developer, Blockchain Engineer..."
            className="input-field"
          />
          <p className="text-slate-600 text-xs mt-2 font-body">
            AI will determine required skills for custom roles
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSelector;
