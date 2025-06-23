import express from 'express';
import { submitResponse } from '../controllers/responseController.js';

const router = express.Router();

router.post('/responses', submitResponse);

export default router; 