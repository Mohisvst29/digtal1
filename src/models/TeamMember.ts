import mongoose, { Schema } from 'mongoose';

const TeamMemberSchema = new Schema({
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  role_ar: { type: String, required: true },
  role_en: { type: String, required: true },
  image_url: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
