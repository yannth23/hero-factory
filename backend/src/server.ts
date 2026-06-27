import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import heroRoutes from './routes/heroes';
import { errorHandler } from './middlewares/errorHandler';
import { initDatabase } from './database/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/heroes', heroRoutes);
app.use(errorHandler);

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
