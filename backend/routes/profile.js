const router = require('express').Router();
const { getProfile, markCourseComplete, removeCourse } = require('../controllers/profileController');
const { auth } = require('../utils/authMiddleware');

router.get('/', auth, getProfile);
router.post('/course/complete', auth, markCourseComplete);
router.post('/course/remove', auth, removeCourse);

module.exports = router;
