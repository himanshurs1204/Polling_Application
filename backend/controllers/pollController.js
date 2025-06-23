import Poll from '../models/Poll.js';

export async function createPoll(req, res) {
  try {
    const { question, options, timeLimit, teacherName } = req.body;
    const poll = new Poll({ question, options, timeLimit, teacherName });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPolls(req, res) {
  try {
    const polls = await Poll.find({ isActive: false }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPollById(req, res) {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 