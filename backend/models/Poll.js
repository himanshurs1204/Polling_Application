import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: String },
  timeLimit: { type: Number, default: 60 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  teacherName: { type: String },
});

export default mongoose.model('Poll', pollSchema); 