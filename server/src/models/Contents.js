const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  durationSec: { type: Number, required: true },
  assignedScreens: [String],
  scheduled: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);