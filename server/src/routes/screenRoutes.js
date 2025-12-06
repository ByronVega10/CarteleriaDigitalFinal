const express = require('express');
const router = express.Router();
const {
  registerScreen,
  getPlaylistForScreen,
  heartbeat,
  assignPlaylistToScreen
} = require('../controllers/screenController');

// POST /api/screens/register
router.post('/register', registerScreen);

// GET  /api/screens/:id/playlist
router.get('/:id/playlist', getPlaylistForScreen);       

// POST /api/screens/:id/heartbeat
router.post('/:id/heartbeat', heartbeat);           

// POST /api/screens/:id/assign/:playlistId
router.post('/:id/assign/:playlistId', assignPlaylistToScreen); 
module.exports = router;