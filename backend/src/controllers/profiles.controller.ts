import { Request, Response, NextFunction } from 'express';
import { ProfilesService } from '../services/profiles.service';


const profilesService = new ProfilesService();

export class ProfilesController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const profile = await profilesService.getProfile(id);

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getAllProfiles(req: Request, res: Response, next: NextFunction) {
    try {
      const profiles = await profilesService.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      next(error);
    }
  }

  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await profilesService.createProfile(userId, req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (userId !== id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await profilesService.deleteProfile(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}