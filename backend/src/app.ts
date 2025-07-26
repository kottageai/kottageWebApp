import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

export default app;