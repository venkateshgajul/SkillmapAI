const User = require('../models/User');
const SkillResult = require('../models/SkillResult');
const ProgressLog = require('../models/ProgressLog');

exports.getProfile = async (req, res) => {
  try {
    const [results, logs] = await Promise.all([
      SkillResult.find({ userId: req.user._id }).sort({ analyzedAt: -1 }).limit(5),
      ProgressLog.find({ userId: req.user._id }).sort({ loggedAt: -1 }).limit(10)
    ]);
    res.json({ user: req.user, recentResults: results, progressLogs: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markCourseComplete = async (req, res) => {
  try {
    const { course } = req.body;
    if (!course) return res.status(400).json({ error: 'Course name required' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { completedCourses: course } },
      { new: true }
    );
    res.json({ completedCourses: user.completedCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeCourse = async (req, res) => {
  try {
    const { course } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { completedCourses: course } },
      { new: true }
    );
    res.json({ completedCourses: user.completedCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
