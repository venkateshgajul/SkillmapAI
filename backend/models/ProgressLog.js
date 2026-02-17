const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  skillMatchPercentage: { type: Number, required: true },
  skillResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillResult' },
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);
