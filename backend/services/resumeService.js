const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return cleanText(data.text);
};

const cleanText = (text) => {
  return text
    .replace(/[^\w\s.,@+#\-\/()&]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const extractSections = (text) => {
  const sections = {};
  const sectionPatterns = {
    experience: /experience|work history|employment/i,
    education: /education|academic|university|college/i,
    skills: /skills|technologies|tools|competencies/i,
    projects: /projects|portfolio/i,
    summary: /summary|objective|profile/i
  };

  const lines = text.split('\n');
  let currentSection = 'other';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let matched = false;
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmed) && trimmed.length < 50) {
        currentSection = section;
        sections[currentSection] = sections[currentSection] || [];
        matched = true;
        break;
      }
    }

    if (!matched) {
      sections[currentSection] = sections[currentSection] || [];
      sections[currentSection].push(trimmed);
    }
  }

  return sections;
};

module.exports = { extractTextFromPDF, cleanText, extractSections };
