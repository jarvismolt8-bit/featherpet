const express = require('express');
const db = require('../db/database');

const router = express.Router();

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

module.exports = router;
