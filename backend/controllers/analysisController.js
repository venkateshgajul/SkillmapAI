const { analyzeSkillGap, getRequiredSkillsForCustomJob } = require('../services/openaiService');
const { calculateSkillGap, getStaticRecommendations } = require('../services/skillGapService');
const jobSkillsMap = require('../utils/jobSkillsMap');
const Resume = require('../models/Resume');
const SkillResult = require('../models/SkillResult');
const ProgressLog = require('../models/ProgressLog');
const { resumeMemoryStore } = require('./resumeController');

exports.getJobList = (req, res) => {
  res.json({ jobs: Object.keys(jobSkillsMap) });
};

exports.analyzeJob = async (req, res) => {
  try {
    const { resumeId, jobTitle, useAI = true } = req.body;
    if (!resumeId || !jobTitle) return res.status(400).json({ error: 'resumeId and jobTitle required' });

    let extractedText = '';
    let resume = null;

    if (req.user) {
      resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
      if (!resume) return res.status(404).json({ error: 'Resume not found' });
      extractedText = resume.extractedText;
    } else {
      const temp = resumeMemoryStore.get(resumeId);
      if (!temp) return res.status(404).json({ error: 'Resume session expired. Please re-upload.' });
      extractedText = temp.extractedText;
    }

    let requiredSkills = jobSkillsMap[jobTitle];
    if (!requiredSkills) {
      try {
        requiredSkills = await getRequiredSkillsForCustomJob(jobTitle);
      } catch {
        requiredSkills = [];
      }
    }

    let result;
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        result = await analyzeSkillGap(extractedText, jobTitle, requiredSkills);
      } catch (aiErr) {
        console.error('AI analysis failed, using static:', aiErr.message);
        result = buildStaticResult(jobTitle, resume?.extractedSkills || [], requiredSkills);
      }
    } else {
      result = buildStaticResult(jobTitle, resume?.extractedSkills || [], requiredSkills);
    }

    if (req.user) {
      const saved = await SkillResult.create({
        userId: req.user._id,
        resumeId: resume?._id,
        jobTitle: result.job_title,
        currentSkills: result.current_skills,
        missingSkills: result.missing_skills,
        skillMatchPercentage: result.skill_match_percentage,
        recommendedCourses: result.recommended_courses,
        recommendedProjects: result.recommended_projects
      });

      await ProgressLog.create({
        userId: req.user._id,
        jobTitle: result.job_title,
        skillMatchPercentage: result.skill_match_percentage,
        skillResultId: saved._id
      });

      result.resultId = saved._id;
    }

    res.json(result);
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const results = await SkillResult.find({ userId: req.user._id })
      .sort({ analyzedAt: -1 })
      .limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const logs = await ProgressLog.find({ userId: req.user._id })
      .sort({ loggedAt: 1 })
      .limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function buildStaticResult(jobTitle, currentSkills, requiredSkills) {
  const { matchedSkills, missingSkills, percentage } = calculateSkillGap(currentSkills, requiredSkills);
  const { recommended_courses, recommended_projects } = getStaticRecommendations(missingSkills);
  return {
    job_title: jobTitle,
    current_skills: currentSkills,
    missing_skills: missingSkills,
    skill_match_percentage: percentage,
    recommended_courses,
    recommended_projects
  };
}
