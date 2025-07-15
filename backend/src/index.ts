import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingsRouter from './routes/bookings';
import profilesRouter from './routes/profiles';
import generateFormRouter from './routes/generateForm';
import { createSupabaseAdminClient, createSupabaseClient } from './lib/supabaseClient';

dotenv.config({ path: `${__dirname}/../.env` });

const app = express();
const port = process.env.PORT || 4000;
export const supabaseAdmin = createSupabaseAdminClient();
export const supabase = createSupabaseClient();

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/generate-form', generateFormRouter);

app.get('/', (req, res) => {
  res.send('Hello from the KottageAI backend!');
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
}); 