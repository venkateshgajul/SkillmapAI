import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { resumeApi } from '../services/api';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const data = await resumeApi.upload(file);
      setUploadedFile({ name: file.name, skills: data.current_skills, resumeId: data.resumeId });
      onUploadSuccess?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group
          ${isDragActive ? 'border-acid bg-acid/5' : 'border-slate-700 hover:border-acid/50 hover:bg-acid/3'}
          ${uploading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-acid/20"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-acid animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-acid/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <p className="text-acid font-display text-sm font-bold">Analyzing Resume...</p>
              <p className="text-slate-500 text-xs mt-1 font-body">Extracting skills with AI</p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-3 animate-fade-up">
            <div className="w-12 h-12 bg-acid/20 rounded-xl flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-acid font-display text-sm font-bold">{uploadedFile.name}</p>
              <p className="text-slate-500 text-xs mt-1">{uploadedFile.skills?.length || 0} skills detected</p>
            </div>
            <p className="text-slate-600 text-xs">Drop another PDF to replace</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`w-14 h-14 mx-auto rounded-xl border-2 flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'border-acid bg-acid/20 scale-110' : 'border-slate-700 group-hover:border-acid/50 group-hover:bg-acid/5'}`}>
              <svg className={`w-7 h-7 transition-colors duration-300 ${isDragActive ? 'text-acid' : 'text-slate-600 group-hover:text-acid/70'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">
                {isDragActive ? 'Drop it here' : 'Drop your resume or click to browse'}
              </p>
              <p className="text-slate-500 text-xs mt-1 font-body">PDF only · Max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-body animate-fade-up">
          {error}
        </div>
      )}

      {uploadedFile?.skills?.length > 0 && (
        <div className="animate-fade-up-delay-1">
          <p className="section-label">Detected Skills</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFile.skills.slice(0, 20).map((skill, i) => (
              <span key={i} className="skill-chip-have">{skill}</span>
            ))}
            {uploadedFile.skills.length > 20 && (
              <span className="skill-chip bg-slate-800 text-slate-500 border-slate-700">
                +{uploadedFile.skills.length - 20} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
