const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/playerRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require("./routes/playlistRoutes");
const screenRoutes = require('./routes/screenRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir el panel administrativo (HTML, CSS, JS)
const path = require('path');
app.use('/admin', express.static(path.join(__dirname, '../../admin-panel')));

// Servir los videos
app.use('/videos', express.static(path.join(__dirname, '../../player/multimediaContent/videos')));

app.use('/admin', express.static(path.join(__dirname, '../../admin-panel')));
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/contents', contentRoutes);
app.use("/api/playlists", playlistRoutes);
app.use('/api/screens', screenRoutes);
app.use('/player', express.static(path.join(__dirname, '../../player')));

app.get('/', (req, res) => res.send('Servidor Cartelería Digital Activo'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`))