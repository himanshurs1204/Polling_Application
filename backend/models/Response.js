import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  studentName: { type: String, required: true },
  selectedOption: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Response', responseSchema); 