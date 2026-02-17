const normalizeSkill = (skill) => skill.toLowerCase().trim();

const calculateSkillGap = (currentSkills, requiredSkills) => {
  const normalizedCurrent = currentSkills.map(normalizeSkill);
  const normalizedRequired = requiredSkills.map(normalizeSkill);

  const matchedSkills = requiredSkills.filter(req =>
    normalizedCurrent.some(cur =>
      cur.includes(normalizeSkill(req)) || normalizeSkill(req).includes(cur)
    )
  );

  const missingSkills = requiredSkills.filter(req =>
    !normalizedCurrent.some(cur =>
      cur.includes(normalizeSkill(req)) || normalizeSkill(req).includes(cur)
    )
  );

  const percentage = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;

  return { matchedSkills, missingSkills, percentage };
};

const getStaticRecommendations = (missingSkills) => {
  const courseMap = {
    python: 'Python Bootcamp - Udemy (Jose Portilla)',
    javascript: 'The Complete JavaScript Course - Udemy (Jonas Schmedtmann)',
    react: 'React - The Complete Guide - Udemy (Maximilian Schwarzmüller)',
    'node.js': 'Node.js Developer Course - Udemy (Andrew Mead)',
    docker: 'Docker & Kubernetes: The Complete Guide - Udemy',
    aws: 'AWS Certified Solutions Architect - A Cloud Guru',
    sql: 'Complete SQL Bootcamp - Udemy (Jose Portilla)',
    mongodb: 'MongoDB - The Complete Developer Guide - Udemy',
    machine_learning: 'Machine Learning Specialization - Coursera (Andrew Ng)',
    tensorflow: 'TensorFlow Developer Certificate - Coursera',
    kubernetes: 'Certified Kubernetes Administrator - Linux Foundation',
    typescript: 'Understanding TypeScript - Udemy',
    git: 'Git & GitHub Bootcamp - Udemy',
    linux: 'Linux Command Line Basics - Udemy'
  };

  const projectMap = {
    python: 'Build a REST API with FastAPI and PostgreSQL',
    javascript: 'Create a real-time chat app with WebSockets',
    react: 'Build a full-stack e-commerce app with React',
    'node.js': 'Build a microservices backend with Express',
    docker: 'Containerize a multi-service application with Docker Compose',
    aws: 'Deploy a scalable app on AWS with EC2 and RDS',
    sql: 'Design and query a relational database for an inventory system',
    mongodb: 'Build a blog platform with MongoDB and Mongoose',
    machine_learning: 'Train a sentiment analysis model on product reviews',
    kubernetes: 'Deploy a microservices app on a Kubernetes cluster'
  };

  const courses = [];
  const projects = [];

  for (const skill of missingSkills.slice(0, 6)) {
    const key = normalizeSkill(skill).replace(/\s+/g, '_');
    const exactKey = Object.keys(courseMap).find(k =>
      normalizeSkill(skill).includes(k) || k.includes(normalizeSkill(skill))
    );
    if (exactKey && courseMap[exactKey]) courses.push(courseMap[exactKey]);
    if (exactKey && projectMap[exactKey]) projects.push(projectMap[exactKey]);
  }

  return {
    recommended_courses: [...new Set(courses)].slice(0, 5),
    recommended_projects: [...new Set(projects)].slice(0, 4)
  };
};

module.exports = { calculateSkillGap, getStaticRecommendations };
