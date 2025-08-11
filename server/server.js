import express from 'express';
import cors from 'cors';
import { savePatient } from './firebase-config.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para guardar pacientes
app.post('/api/patients', async (req, res) => {
  try {
    const patientId = await savePatient(req.body);
    res.status(201).json({ id: patientId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para estadísticas
app.get('/api/stats', async (req, res) => {
  const stats = await calculateStats();
  res.json(stats);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
