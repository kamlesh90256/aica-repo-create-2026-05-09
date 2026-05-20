import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { prisma } from '../prisma';
import { createEmbedding, upsertToVectorDB } from '../services/embeddings';

const router = Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

type ResumeAnalysis = {
  atsScore: number;
  extractedSkills: string[];
  suggestions: string[];
  summary: string;
};

const SKILL_KEYWORDS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'Kubernetes',
  'AWS',
  'Git',
  'REST',
  'GraphQL',
  'OpenAI',
  'Stripe',
  'Tailwind CSS',
  'Socket.IO',
  'MongoDB',
  'Python',
  'SQL'
];

const SECTION_PATTERNS = [
  { label: 'summary', pattern: /\b(summary|profile|objective)\b/i },
  { label: 'experience', pattern: /\b(experience|employment|work history)\b/i },
  { label: 'education', pattern: /\b(education|academic background)\b/i },
  { label: 'skills', pattern: /\b(skills|technical skills|core competencies)\b/i },
  { label: 'projects', pattern: /\b(projects|selected projects)\b/i }
];

const ACTION_VERBS = [
  'built',
  'created',
  'led',
  'developed',
  'designed',
  'improved',
  'increased',
  'reduced',
  'delivered',
  'implemented',
  'optimized',
  'launched',
  'automated',
  'owned'
];

function cleanText(text: string) {
  return text
    .replace(/\u0000/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]+/g, ' ')
    .trim();
}

async function extractResumeText(filePath: string, mimetype: string, originalName: string) {
  const extension = path.extname(originalName).toLowerCase();
  const buffer = await fs.promises.readFile(filePath);

  if (mimetype.startsWith('text/') || ['.txt', '.md', '.csv', '.rtf'].includes(extension)) {
    return cleanText(buffer.toString('utf8'));
  }

  if (mimetype === 'application/pdf' || extension === '.pdf') {
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return cleanText(parsed.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return cleanText(parsed.value);
  }

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, TXT, or MD file.');
}

function getDetectedSkills(text: string) {
  const normalized = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => normalized.includes(skill.toLowerCase()));
}

function countActionVerbs(text: string) {
  const lower = text.toLowerCase();
  return ACTION_VERBS.reduce((count, verb) => count + (lower.includes(verb) ? 1 : 0), 0);
}

function countMetrics(text: string) {
  const metricMatches = text.match(/\b\d+(?:\.\d+)?%?\b/g) || [];
  const strongMetrics = text.match(/\b\d+[kKmM]?\+?\b/g) || [];
  return new Set([...metricMatches, ...strongMetrics]).size;
}

function buildSummary(text: string) {
  const firstSentence = text.split(/[.!?]\s+/).find(Boolean) || text.slice(0, 180);
  return cleanText(firstSentence).slice(0, 220);
}

function analyzeResume(text: string): ResumeAnalysis {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const skills = getDetectedSkills(text);
  const sectionsFound = SECTION_PATTERNS.filter(({ pattern }) => pattern.test(text)).length;
  const metricsCount = countMetrics(text);
  const actionVerbCount = countActionVerbs(text);

  const structureScore = Math.min(30, sectionsFound * 6);
  const skillScore = Math.min(25, skills.length * 3 + (skills.length >= 5 ? 10 : 0));
  const impactScore = Math.min(20, metricsCount * 4 + actionVerbCount * 2);
  const lengthScore = wordCount >= 250 ? 15 : Math.max(0, Math.round((wordCount / 250) * 15));
  const atsScore = Math.max(0, Math.min(100, structureScore + skillScore + impactScore + lengthScore));

  const suggestions: string[] = [];
  if (sectionsFound < 3) suggestions.push('Add clearer resume sections such as summary, experience, skills, and education.');
  if (!skills.length) suggestions.push('Add a dedicated skills section with the tools and technologies you actually use.');
  if (metricsCount < 2) suggestions.push('Add quantifiable results such as percentages, revenue, time saved, or user counts.');
  if (actionVerbCount < 3) suggestions.push('Start bullets with strong action verbs like built, led, improved, or implemented.');
  if (wordCount < 200) suggestions.push('Expand experience bullets so each role shows scope, outcome, and impact.');
  if (suggestions.length === 0) suggestions.push('Keep tailoring the resume to each role by mirroring keywords from the job description.');

  return {
    atsScore,
    extractedSkills: skills,
    suggestions,
    summary: buildSummary(text)
  };
}

function getAuthenticatedUserId(req: any) {
  const header = req.headers.authorization as string | undefined;
  if (!header) return null;

  const token = header.split(' ')[1];
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    const payload = jwt.verify(token, secret) as any;
    return payload.sub || payload.id || null;
  } catch {
    return null;
  }
}

router.post('/analyze', upload.single('resume'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file' });
  }

  try {
    const text = await extractResumeText(file.path, file.mimetype, file.originalname);
    if (!text) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded resume.' });
    }

    const result = analyzeResume(text);
    const userId = getAuthenticatedUserId(req);

    if (userId) {
      const resumeRecord = await prisma.resume.create({
        data: {
          userId,
          atsScore: result.atsScore,
          extractedSkills: result.extractedSkills,
          summary: result.summary,
          suggestions: result.suggestions
        }
      });

      const embedding = await createEmbedding(text.slice(0, 6000));
      await upsertToVectorDB(resumeRecord.id, embedding, {
        userId,
        atsScore: result.atsScore,
        skills: result.extractedSkills,
        type: 'resume-analysis'
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Resume analysis failed';
    const statusCode = message.startsWith('Unsupported file type') ? 415 : 500;
    res.status(statusCode).json({ error: message });
  } finally {
    if (file?.path) {
      fs.promises.unlink(file.path).catch(() => undefined);
    }
  }
});

export default router;
