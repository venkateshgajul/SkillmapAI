const router = require('express').Router();
const { analyzeJob, getJobList, getHistory, getProgress } = require('../controllers/analysisController');
const { auth } = require('../utils/authMiddleware');

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) return auth(req, res, next);
  next();
};

router.get('/jobs', getJobList);
router.post('/analyze-job', optionalAuth, analyzeJob);
router.get('/history', auth, getHistory);
router.get('/progress', auth, getProgress);

module.exports = router;
