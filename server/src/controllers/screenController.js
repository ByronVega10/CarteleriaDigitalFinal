const Screen = require('../models/Screen');
const Playlist = require('../models/Playlist');
const { nanoid } = require('nanoid'); // instalar: npm i nanoid

exports.registerScreen = async (req, res) => {
  try {
    const { name } = req.body || {};
    const token = nanoid(24);
    const s = new Screen({ name: name || 'Pantalla', token, status: 'online' });
    await s.save();
    res.json({ id: s._id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registrando pantalla' });
  }
};

exports.getPlaylistForScreen = async (req, res) => {
  try {
    const id = req.params.id;
    const screen = await Screen.findById(id).populate({ path: 'assignedPlaylist', populate: { path: 'videos' }});
    if (!screen) return res.status(404).json({ message: 'Screen no encontrada' });
    res.json({ playlist: screen.assignedPlaylist || null, screenStatus: screen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo playlist' });
  }
};

exports.heartbeat = async (req, res) => {
  try {
    const id = req.params.id;
    await Screen.findByIdAndUpdate(id, { lastSeen: Date.now(), status: 'online' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error heartbeat' });
  }
};

exports.assignPlaylistToScreen = async (req, res) => {
  try {
    const { id, playlistId } = req.params;
    const screen = await Screen.findByIdAndUpdate(id, { assignedPlaylist: playlistId }, { new: true }).populate({ path: 'assignedPlaylist', populate: { path: 'videos' }});
    if (!screen) return res.status(404).json({ message: 'Screen no encontrada' });
    // Opcional: aquí podrías emitir un evento socket para notificar en tiempo real
    res.json(screen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error asignando playlist' });
  }
};