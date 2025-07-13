import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingsRouter from './routes/bookings';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Not Loaded');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingsRouter);

app.get('/', (req, res) => {
  res.send('Hello from the KottageAI backend!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
}); 