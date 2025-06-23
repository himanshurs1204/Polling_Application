import Response from '../models/Response.js';
import Poll from '../models/Poll.js';

export async function submitResponse(req, res) {
  try {
    const { pollId, studentName, selectedOption } = req.body;
    const response = new Response({ pollId, studentName, selectedOption });
    await response.save();
    // Optionally: check if all students have answered, end poll, etc.
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function createPoll(req, res) {
  try {
    const { question, options, timeLimit, teacherName, correctOption } = req.body;
    const poll = new Poll({ question, options, timeLimit, teacherName, correctOption });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
} 