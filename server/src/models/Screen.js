const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
  name: { type: String, default: "Pantalla" },
  token: { type: String }, // opcional para auth simple
  assignedPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', default: null },
  lastSeen: { type: Date, default: Date.now },
  status: { type: String, enum: ['online','offline'], default: 'offline' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screen', ScreenSchema);