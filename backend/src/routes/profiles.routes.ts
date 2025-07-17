import { Router } from 'express';
import { ProfilesController } from '../controllers/profiles.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { CreateProfileSchema } from '../types/profiles';

const router = Router();
const profilesController = new ProfilesController();

// public routes
router.get('/:id', profilesController.getProfile.bind(profilesController));
router.get('/', profilesController.getAllProfiles.bind(profilesController));

// protected routes
router.post(
  '/', 
  authMiddleware,
  validate(CreateProfileSchema), 
  profilesController.createProfile.bind(profilesController)
);

router.delete(
  '/:id', authMiddleware, profilesController.deleteProfile.bind(profilesController)
);

export default router;