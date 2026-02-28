const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String },  // Computed from first + last
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  emailToken: String,
  codeWords: [String],
  attempts: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'verified', 'success', 'failed'], default: 'pending' },
  optInSMS: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: '1h' }  // Auto-expire test sessions
});

module.exports = mongoose.model('User', userSchema);