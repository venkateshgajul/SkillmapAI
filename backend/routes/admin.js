const router = require('express').Router();
const { adminAuth } = require('../utils/authMiddleware');
const User = require('../models/User');
const SkillResult = require('../models/SkillResult');

router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalAnalyses, topJobs] = await Promise.all([
      User.countDocuments(),
      SkillResult.countDocuments(),
      SkillResult.aggregate([
        { $group: { _id: '$jobTitle', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);
    res.json({ totalUsers, totalAnalyses, topJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export-csv', adminAuth, async (req, res) => {
  try {
    const results = await SkillResult.find().populate('userId', 'name email').lean();
    const rows = results.map(r => `${r.userId?.email},${r.jobTitle},${r.skillMatchPercentage}`);
    const csv = ['email,job_title,match_percentage', ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=skill-results.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
