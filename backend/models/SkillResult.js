const mongoose = require('mongoose');

const skillResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobTitle: { type: String, required: true },
  currentSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  skillMatchPercentage: { type: Number, default: 0 },
  recommendedCourses: [{ type: String }],
  recommendedProjects: [{ type: String }],
  analyzedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkillResult', skillResultSchema);
