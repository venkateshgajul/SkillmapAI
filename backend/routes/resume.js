const router = require('express').Router();
const multer = require('multer');
const { uploadResume, getResume, listResumes } = require('../controllers/resumeController');
const { auth } = require('../utils/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  }
});

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) return auth(req, res, next);
  next();
};

router.post('/upload-resume', optionalAuth, upload.single('resume'), uploadResume);
router.get('/:id', auth, getResume);
router.get('/', auth, listResumes);

module.exports = router;
