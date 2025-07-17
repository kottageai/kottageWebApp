import { Router } from 'express';
import profilesRoutes from './profiles.routes';

const router = Router();

router.use('/profiles', profilesRoutes);

export default router;