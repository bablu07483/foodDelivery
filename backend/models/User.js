const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  // OTP Fields
  otp: { type: String },
  otpExpires: { type: Date },
  // --- NEW DIET FIELDS START ---
  dietType: { type: String, enum: ['normal', 'customize'], default: 'normal' },
  dietProfile: {
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    weight: { type: Number },
    height: { type: Number },
    activityLevel: { type: Number, default: 1.2 },
    nutritionGoal: { type: String, trim: true }
  }
  // --- NEW DIET FIELDS END ---
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);