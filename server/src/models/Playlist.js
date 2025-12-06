const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    videos: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Content" }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Playlist", PlaylistSchema);