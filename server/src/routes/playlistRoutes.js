const express = require("express");
const router = express.Router();

const {
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
} = require("../controllers/playlistController");

// GET /api/playlists
router.get("/", getPlaylists);

// POST /api/playlists
router.post("/", createPlaylist);

// PUT /api/playlists/:id
router.put("/:id", updatePlaylist);

// DELETE /api/playlists/:id
router.delete("/:id", deletePlaylist);

module.exports = router;