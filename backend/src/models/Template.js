const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi']
  },
  content: {
    type: String,
    required: [true, 'Template content is required']
  },
  variables: [{
    type: String
  }],
  version: {
    type: String,
    default: '1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    author: String,
    description: String,
    tags: [String]
  }
}, {
  timestamps: true
});

// Index for faster queries
templateSchema.index({ department: 1, language: 1 });

module.exports = mongoose.model('Template', templateSchema);
