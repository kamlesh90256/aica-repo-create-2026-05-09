import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    // In production: validate file type, scan for malware, extract text, generate embeddings
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    // Simple move to uploads folder with original name
    const target = path.join(__dirname, '../../uploads', file.originalname);
    fs.renameSync(file.path, target);
    res.json({ fileUrl: `/uploads/${file.originalname}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
