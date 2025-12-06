const screenService = require('../services/screenService');

async function getPlaylist(req, res) {
  try {
    const playlist = await screenService.getPlayerPlaylist(req.params.id);
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener playlist' });
  }
}

module.exports = { getPlaylist };