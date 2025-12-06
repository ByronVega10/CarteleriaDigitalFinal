const express = require('express');
const { getPlaylist } = require('../controllers/playerController');
const router = express.Router();

router.get('/:id/playlist', getPlaylist);

module.exports = router;