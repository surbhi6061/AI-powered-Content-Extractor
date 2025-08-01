// models/Entry.js
import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
  },
  key_points: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
