// server/scripts/importVideos.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // carga server/.env

// Ajusta la ruta al modelo (server/src/models/Contents.js)
const Content = require(path.join(__dirname, '..', 'src', 'models', 'Contents'));

// 1) Conectar a MongoDB usando MONGO_URI definido en server/.env
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // estas opciones ya no son necesarias en versiones recientes, mongoose las ignora
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
}

// 2) Carpeta donde están los videos (project_root/player/multimediaContent/videos)
const videoFolder = path.join(__dirname, '..', '..', 'player', 'multimediaContent', 'videos');

// 3) Duración por defecto (puedes mejorar esto luego)
function getDurationByName(filename) {
  // para empezar devolvemos 10s por defecto
  return 10;
}

async function importVideos() {
  // comprobar que la carpeta existe
  if (!fs.existsSync(videoFolder)) {
    console.error('❌ Carpeta de videos no encontrada:', videoFolder);
    process.exit(1);
  }

  const files = fs.readdirSync(videoFolder).filter(f => /\.mp4$/i.test(f));
  if (files.length === 0) {
    console.log('ℹ️ No hay archivos mp4 en la carpeta:', videoFolder);
    process.exit(0);
  }

  for (const file of files) {
    try {
      // comprobar si ya existe (busca por parte del nombre del archivo en fileUrl)
      const exists = await Content.findOne({ fileUrl: { $regex: file } });
      if (exists) {
        console.log(`⏭️ Ya existe en Mongo: ${file}`);
        continue;
      }

      const doc = {
        title: file.replace(/\.mp4$/i, ''),
        fileUrl: `http://localhost:3000/videos/${file}`,
        durationSec: getDurationByName(file),
        assignedScreens: [],
        scheduled: new Date()
      };

      const created = await Content.create(doc);
      console.log(`✔ Insertado: ${file} -> id: ${created._id}`);
    } catch (err) {
      console.error('❌ Error insertando', file, err);
    }
  }

  console.log('✅ Importación completada.');
  process.exit(0);
}

// Ejecutar
(async () => {
  await connect();
  await importVideos();
})();