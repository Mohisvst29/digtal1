import mongoose, { Schema } from 'mongoose';

const ContentSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
