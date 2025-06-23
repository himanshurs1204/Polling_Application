import express from 'express';
import { createPoll, getPolls, getPollById } from '../controllers/pollController.js';

const router = express.Router();

router.post('/polls', createPoll);
router.get('/polls', getPolls);
router.get('/polls/:id', getPollById);

export default router; 