import mongoose, { Schema } from 'mongoose';

const LeadSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  clientType: { type: String, default: '' },
  specialty: { type: String, default: '' },
  services: { type: [String], default: [] },
  budget: { type: String, default: '' },
  referrer: { type: String, default: '' },
  message: { type: String, default: '' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
