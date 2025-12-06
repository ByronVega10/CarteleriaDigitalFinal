const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Asegura que lee el .env
dotenv.config({ path: require('path').join(__dirname, '../../.env') });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carteleria', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;