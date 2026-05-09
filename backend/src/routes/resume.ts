import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    // TODO: extract text, call OpenAI to analyze, compute ATS score
    // Return mocked response for now
    const result = {
      atsScore: 72,
      extractedSkills: ['JavaScript', 'TypeScript', 'Node.js'],
      suggestions: ['Add more quantifiable metrics', 'Tailor to job description']
    };
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

export default router;
