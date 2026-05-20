const express = require('express');
const multer = require('multer');
const db = require('../db/database');

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', (req, res) => {
  const pets = db.prepare(
    'SELECT id, name, type, age_years, photo_url FROM pets'
  ).all();
  res.json(pets);
});

router.get('/:id', (req, res) => {
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
  if (!pet) {
    return res.status(404).json({ error: 'Pet not found' });
  }
  res.json(pet);
});

router.post('/:id/photo', upload.single('photo'), (req, res) => {
  const pet = db.prepare('SELECT id FROM pets WHERE id = ?').get(req.params.id);
  if (!pet) {
    if (req.file) {
      require('fs').unlinkSync(req.file.path);
    }
    return res.status(404).json({ error: 'Pet not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const photoUrl = `/uploads/${req.file.filename}`;
  db.prepare(
    "UPDATE pets SET photo_url = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(photoUrl, req.params.id);

  const updated = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
  res.json(updated);
});

module.exports = router;
