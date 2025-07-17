import { Router } from 'express';
import profilesRoutes from './profiles.routes';
import generateRoutes from './generate';

const router = Router();

router.use('/profiles', profilesRoutes);
router.use('/generate', generateRoutes);

export default router;