import mongoose, { Schema } from 'mongoose';

const MediaSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
