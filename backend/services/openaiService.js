const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Comprehensive list of technical skills to search for
const SKILL_KEYWORDS = {
  'Python': ['python', 'py', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
  'JavaScript': ['javascript', 'js', 'typescript', 'node.js', 'nodejs', 'react', 'angular', 'vue.js', 'express'],
  'Java': ['java', 'spring boot', 'maven', 'gradle'],
  'C++': ['c++', 'cpp', 'c plus plus'],
  'C#': ['c#', 'csharp', '.net', 'dotnet'],
  'Web Development': ['html', 'css', 'web development', 'responsive design'],
  'React': ['react', 'react.js', 'jsx'],
  'Angular': ['angular', 'angular.js'],
  'Vue.js': ['vue.js', 'vue', 'vuejs'],
  'Node.js': ['node.js', 'nodejs', 'node'],
  'Express.js': ['express', 'express.js'],
  'MongoDB': ['mongodb', 'mongo', 'nosql database'],
  'SQL': ['sql', 'mysql', 'postgresql', 'oracle'],
  'PostgreSQL': ['postgresql', 'postgres', 'psql'],
  'MySQL': ['mysql', 'mariadb'],
  'Firebase': ['firebase', 'firestore'],
  'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  'Azure': ['azure', 'microsoft azure'],
  'GCP': ['google cloud', 'gcp', 'cloud platform'],
  'Docker': ['docker', 'containerization'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'Git': ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
  'CI/CD': ['cicd', 'ci/cd', 'jenkins', 'gitlab ci', 'github actions'],
  'REST API': ['rest api', 'restful', 'api design'],
  'GraphQL': ['graphql'],
  'Machine Learning': ['machine learning', 'ml', 'deep learning', 'neural network'],
  'TensorFlow': ['tensorflow'],
  'Pytorch': ['pytorch', 'torch'],
  'Data Science': ['data science', 'data analysis', 'analytics'],
  'Data Analysis': ['data analysis', 'analytics', 'tableau', 'power bi'],
  'Tableau': ['tableau'],
  'Power BI': ['power bi', 'powerbi'],
  'Excel': ['excel', 'vba', 'advanced excel'],
  'Linux': ['linux', 'ubuntu', 'centos', 'shell scripting', 'bash'],
  'Bash': ['bash', 'shell scripting'],
  'Windows Server': ['windows server', 'active directory', 'ad'],
  'Agile': ['agile', 'scrum', 'kanban', 'sprint'],
  'Scrum': ['scrum', 'scrum master', 'sprint planning'],
  'Project Management': ['project management', 'pmp', 'jira'],
  'Communication': ['communication', 'presentation'],
  'Leadership': ['leadership', 'team lead', 'management'],
  'Problem Solving': ['problem solving', 'logical thinking'],
  'Object Oriented Programming': ['oop', 'object oriented', 'design patterns'],
  'Functional Programming': ['functional programming', 'immutability'],
  'Test Driven Development': ['tdd', 'unit testing', 'junit', 'pytest'],
  'Security': ['security', 'cybersecurity', 'encryption'],
  'API': ['api', 'integration'],
  'JSON': ['json'],
  'XML': ['xml'],
  'YAML': ['yaml'],
  'Webpack': ['webpack'],
  'Npm': ['npm', 'package management'],
  'Yarn': ['yarn'],
  'Debugging': ['debugging', 'troubleshooting'],
  'Performance Optimization': ['performance optimization', 'profiling'],
  'Mobile Development': ['mobile development', 'ios', 'android'],
  'React Native': ['react native'],
  'Flutter': ['flutter'],
  'Swift': ['swift'],
  'Kotlin': ['kotlin'],
  'Cloud Computing': ['cloud computing', 'cloud services'],
  'Microservices': ['microservices', 'microservice architecture'],
  'DevOps': ['devops', 'infrastructure'],
  'System Design': ['system design', 'architecture'],
  'Networking': ['networking', 'tcp/ip']
};

const extractSkillsByKeywords = (text) => {
  const textLower = text.toLowerCase();
  const foundSkills = new Set();

  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(textLower)) {
        foundSkills.add(skill);
        break;
      }
    }
  }

  return Array.from(foundSkills).sort();
};

const extractSkillsFromResume = async (resumeText) => {
  // If no OpenAI key, use local keyword extraction
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-key')) {
    console.log('No valid OpenAI key, using local skill extraction');
    const localSkills = extractSkillsByKeywords(resumeText);
    return { current_skills: localSkills };
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a resume parser. Extract all technical and soft skills from the resume text. Return ONLY valid JSON with no explanation, no markdown. Format: {"current_skills": ["skill1","skill2"]}'
        },
        { role: 'user', content: `Extract skills from this resume:\n\n${resumeText.slice(0, 4000)}` }
      ]
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.current_skills || !Array.isArray(parsed.current_skills)) {
      throw new Error('Invalid skills response format');
    }
    return parsed;
  } catch (aiErr) {
    console.warn('OpenAI extraction failed, falling back to keyword extraction:', aiErr.message);
    const localSkills = extractSkillsByKeywords(resumeText);
    return { current_skills: localSkills };
  }
};

const analyzeSkillGap = async (resumeText, jobTitle, requiredSkills) => {
  // If no OpenAI key, use local analysis
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-key')) {
    console.log('No valid OpenAI key, using local skill gap analysis');
    return buildLocalSkillGapAnalysis(resumeText, jobTitle, requiredSkills);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `Analyze resume text and compare with required skills for job title: ${jobTitle}.
Return ONLY valid JSON with no explanation, no markdown:
{
  "job_title": "${jobTitle}",
  "current_skills": [],
  "missing_skills": [],
  "skill_match_percentage": 0,
  "recommended_courses": [],
  "recommended_projects": []
}
Rules:
- current_skills: skills found in resume
- missing_skills: required skills NOT in resume (from list: ${requiredSkills?.join(', ') || 'analyze from context'})
- skill_match_percentage: integer 0-100
- recommended_courses: 4-6 specific online course names/platforms for missing skills
- recommended_projects: 3-5 project ideas to build missing skills
No extra text. No markdown. Pure JSON only.`
        },
        { role: 'user', content: `Resume:\n${resumeText.slice(0, 4000)}\n\nRequired Skills: ${requiredSkills?.join(', ')}` }
      ]
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const required = ['job_title', 'current_skills', 'missing_skills', 'skill_match_percentage', 'recommended_courses', 'recommended_projects'];
    for (const field of required) {
      if (!(field in parsed)) throw new Error(`Missing field: ${field}`);
    }
    return parsed;
  } catch (err) {
    console.warn('OpenAI skill gap analysis failed, using local analysis:', err.message);
    return buildLocalSkillGapAnalysis(resumeText, jobTitle, requiredSkills);
  }
};

const buildLocalSkillGapAnalysis = (resumeText, jobTitle, requiredSkills = []) => {
  const currentSkills = extractSkillsByKeywords(resumeText);
  const missingSkills = (requiredSkills || []).filter(skill => !currentSkills.includes(skill));
  
  const skillMatchPercentage = requiredSkills?.length > 0 
    ? Math.round(((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100)
    : 0;

  const courseMap = {
    'Python': 'Python for Everyone (Coursera)',
    'JavaScript': 'The Complete JavaScript Course (Udemy)',
    'React': 'React - The Complete Guide (Udemy)',
    'Java': 'Java Programming MOOC by University of Helsinki',
    'Data Science': 'Data Science Specialization (Coursera)',
    'Machine Learning': 'Machine Learning A-Z (Udemy)',
    'AWS': 'AWS Certified Solutions Architect (A Cloud Guru)',
    'Docker': 'Docker Mastery (Udemy)',
    'Kubernetes': 'Learn Kubernetes (Udemy)',
    'MongoDB': 'MongoDB - The Complete Developer\'s Guide (Udemy)',
    'SQL': 'The Complete SQL Bootcamp (Udemy)',
    'DevOps': 'DevOps Foundations (Linux Academy)',
    'Leadership': 'Effective Leadership Communication (Coursera)',
    'Project Management': 'Google Project Management Certificate (Coursera)'
  };

  const projectMap = {
    'Python': ['Build a web scraper', 'Create a data analysis tool', 'Develop a Python game'],
    'JavaScript': ['Build a Todo App', 'Create a weather forecast app', 'Develop a real-time chat application'],
    'React': ['Build a ecommerce dashboard', 'Create a social media feed', 'Develop a project management tool'],
    'Machine Learning': ['Build a prediction model', 'Create an image classification system', 'Develop a recommendation engine'],
    'DevOps': ['Set up CI/CD pipeline', 'Deploy app with Docker', 'Automate infrastructure with Kubernetes'],
    'Data Science': ['Analyze public datasets', 'Build predictive models', 'Create data visualizations'],
    'AWS': ['Deploy application on EC2', 'Build serverless function on Lambda', 'Set up RDS database'],
    'Docker': ['Containerize a microservice', 'Create multi-container setup', 'Set up container registry'],
    'Mobile Development': ['Build a fitness tracker app', 'Create a note-taking app', 'Develop a social app']
  };

  const recommendedCourses = missingSkills
    .slice(0, 4)
    .map(skill => courseMap[skill] || `${skill} Masterclass (Udemy)`)
    .filter(Boolean);

  const recommendedProjects = missingSkills
    .slice(0, 3)
    .flatMap(skill => projectMap[skill] || [`Build a ${skill} project`])
    .slice(0, 5);

  return {
    job_title: jobTitle,
    current_skills: currentSkills,
    missing_skills: missingSkills,
    skill_match_percentage: skillMatchPercentage,
    recommended_courses: recommendedCourses.length > 0 ? recommendedCourses : ['Complete online courses for improving skills'],
    recommended_projects: recommendedProjects.length > 0 ? recommendedProjects : ['Work on hands-on projects to build skills']
  };
};

const getRequiredSkillsForCustomJob = async (jobTitle) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-key')) {
    console.log('No valid OpenAI key, returning default skills for job:', jobTitle);
    return getDefaultSkillsForJob(jobTitle);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON with no explanation. Format: {"required_skills": ["skill1","skill2"]} — list 8-12 essential skills for the given job title.'
        },
        { role: 'user', content: `What are the required skills for: ${jobTitle}?` }
      ]
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.required_skills || [];
  } catch (err) {
    console.warn('Failed to get required skills from OpenAI, using defaults:', err.message);
    return getDefaultSkillsForJob(jobTitle);
  }
};

const getDefaultSkillsForJob = (jobTitle) => {
  const skillMap = {
    'frontend developer': ['JavaScript', 'React', 'HTML', 'CSS', 'Web Development', 'npm', 'Git', 'REST API'],
    'backend developer': ['Python', 'Java', 'SQL', 'API Design', 'Docker', 'Git', 'Database Design', 'REST API'],
    'full stack developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'Git', 'Docker', 'REST API'],
    'data scientist': ['Python', 'Data Science', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Data Analysis', 'Tableau'],
    'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'Git', 'Jenkins', 'Infrastructure'],
    'mobile developer': ['JavaScript', 'React Native', 'Swift', 'Kotlin', 'Mobile Development', 'Git', 'API Integration', 'Testing'],
    'qa engineer': ['Testing', 'Automation', 'Debugging', 'Git', 'Problem Solving', 'Documentation', 'Communication', 'Agile'],
    'project manager': ['Project Management', 'Agile', 'Leadership', 'Communication', 'Time Management', 'Problem Solving', 'Scrum', 'Jira']
  };

  const lowerJobTitle = jobTitle.toLowerCase();
  for (const [key, skills] of Object.entries(skillMap)) {
    if (lowerJobTitle.includes(key)) {
      return skills;
    }
  }

  // Default generic skills
  return ['Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Time Management', 'Adaptability', 'Critical Thinking', 'Continuous Learning'];
};

module.exports = { extractSkillsFromResume, analyzeSkillGap, getRequiredSkillsForCustomJob };
