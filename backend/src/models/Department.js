const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  contactInfo: {
    address: String,
    email: String,
    phone: String
  },
  parentDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for keyword search
departmentSchema.index({ keywords: 1 });
departmentSchema.index({ name: 'text', keywords: 'text' });

module.exports = mongoose.model('Department', departmentSchema);
