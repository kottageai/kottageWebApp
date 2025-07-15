import { Router } from 'express';
import { generateBookingFormFields } from '../lib/gemini';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid description' });
    }
    const result = await generateBookingFormFields(description);
    if (!result || typeof result !== 'object' || !result.classification || !result.extracted_fields) {
      return res.status(500).json({ error: 'Invalid response from Gemini' });
    }
    return res.json(result);
  } catch (e) {
    const error = e as Error;
    return res.status(500).json({ error: 'Gemini API error', details: error.message });
  }
});

export default router; 