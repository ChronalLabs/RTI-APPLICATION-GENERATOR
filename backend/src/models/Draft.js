const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true
  },
  applicantAddress: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    type: String,
    trim: true
  }],
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  draftText: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  warnings: [{
    type: String
  }],
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi']
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'submitted'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for faster queries
draftSchema.index({ department: 1, createdAt: -1 });

module.exports = mongoose.model('Draft', draftSchema);
