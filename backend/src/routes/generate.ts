import { Router } from 'express';
import { generateBookingFormFields } from '../services/gemini';

const router = Router();

router.post('/form-fields', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const fields = await generateBookingFormFields(description);
    if (fields) {
      res.json(fields);
    } else {
      res.status(500).json({ error: 'Failed to generate form fields' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

export default router; 