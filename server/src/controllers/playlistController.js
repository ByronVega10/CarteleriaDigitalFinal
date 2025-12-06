const Playlist = require("../models/Playlist");

exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().populate("videos");
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: "Error obteniendo playlists" });
    }
};

exports.createPlaylist = async (req, res) => {
    try {
        const playlist = new Playlist({
            name: req.body.name,
            videos: req.body.videos || []
        });

        const saved = await playlist.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Error creando playlist" });
    }
};

exports.updatePlaylist = async (req, res) => {
    try {
        const updated = await Playlist.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                videos: req.body.videos
            },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error actualizando playlist" });
    }
};

exports.deletePlaylist = async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: "Playlist eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando playlist" });
    }
};