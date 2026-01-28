const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true,
    enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in', 'not_in']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['setTemplate', 'addWarning', 'setScore', 'addQuestion', 'modifyField']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Rule name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  conditions: {
    type: [conditionSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one condition is required']
  },
  actions: {
    type: [actionSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one action is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
ruleSchema.index({ priority: -1, isActive: 1 });

module.exports = mongoose.model('Rule', ruleSchema);
