const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db/database');

const petsRouter = require('./routes/pets');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/pets', petsRouter);

app.listen(PORT, () => {
  console.log(`FeatherPet backend running on http://localhost:${PORT}`);
});
