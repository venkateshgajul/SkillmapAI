const { extractTextFromPDF } = require('../services/resumeService');
const { extractSkillsFromResume } = require('../services/openaiService');
const Resume = require('../models/Resume');

// Fallback local skill extraction (same as in openaiService for consistency)
const extractSkillsLocally = (text) => {
  const SKILLS = {
    'Python': ['python', 'py', 'django', 'flask', 'fastapi'],
    'JavaScript': ['javascript', 'js', 'typescript', 'react', 'angular', 'vue', 'node.js'],
    'Java': ['java', 'spring boot', 'maven', 'hibernate'],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'csharp', '.net'],
    'Web Development': ['html', 'css', 'responsive'],
    'MongoDB': ['mongodb', 'mongo', 'nosql'],
    'SQL': ['sql', 'mysql', 'postgresql', 'oracle', 'database'],
    'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
    'Docker': ['docker', 'containerization'],
    'Git': ['git', 'github', 'gitlab', 'version control'],
    'REST API': ['rest api', 'restful', 'api'],
    'Machine Learning': ['machine learning', 'ml', 'deep learning', 'tensorflow', 'pytorch'],
    'Data Science': ['data science', 'data analysis', 'analytics'],
    'Agile': ['agile', 'scrum', 'kanban'],
    'Leadership': ['leadership', 'team lead'],
    'Communication': ['communication', 'presentation']
  };

  const textLower = text.toLowerCase();
  const foundSkills = new Set();

  for (const [skill, keywords] of Object.entries(SKILLS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        foundSkills.add(skill);
        break;
      }
    }
  }

  return Array.from(foundSkills).sort();
};

const resumeMemoryStore = new Map();

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files allowed' });
    }

    console.log('Extracting text from PDF...');
    const extractedText = await extractTextFromPDF(req.file.buffer);
    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    console.log(`Extracted ${extractedText.length} characters from resume`);

    let skillData = { current_skills: [] };
    try {
      console.log('Attempting skill extraction...');
      skillData = await extractSkillsFromResume(extractedText);
      console.log(`Successfully extracted ${skillData.current_skills.length} skills`);
    } catch (aiErr) {
      console.error('Skill extraction error:', aiErr.message);
      console.log('Falling back to local skill extraction...');
      skillData = { current_skills: extractSkillsLocally(extractedText) };
      console.log(`Local extraction found ${skillData.current_skills.length} skills`);
    }

    // Ensure we always have some skills
    if (!skillData.current_skills || skillData.current_skills.length === 0) {
      console.warn('No skills found, using local extraction as final fallback');
      skillData.current_skills = extractSkillsLocally(extractedText);
    }

    let savedResume = null;
    if (req.user) {
      savedResume = await Resume.create({
        userId: req.user._id,
        fileName: req.file.originalname,
        extractedText,
        extractedSkills: skillData.current_skills
      });
    } else {
      const tempId = Date.now().toString();
      resumeMemoryStore.set(tempId, { extractedText, extractedSkills: skillData.current_skills, fileName: req.file.originalname });
      return res.json({
        success: true,
        resumeId: tempId,
        fileName: req.file.originalname,
        extractedText: extractedText.slice(0, 500) + '...',
        current_skills: skillData.current_skills,
        temporary: true
      });
    }

    res.json({
      success: true,
      resumeId: savedResume._id,
      fileName: savedResume.fileName,
      extractedText: extractedText.slice(0, 500) + '...',
      current_skills: skillData.current_skills
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ uploadedAt: -1 })
      .limit(10);
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.resumeMemoryStore = resumeMemoryStore;
