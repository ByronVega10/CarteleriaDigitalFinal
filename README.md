# 🖥️ Cartelería Digital

Proyecto de cartelería digital con **Node.js + Express + MongoDB** en el backend y un **player HTML/JS** que reproduce videos locales.

---

## 📁 Estructura del proyecto
carteleria-digital/
│
├── server/ # Servidor principal (CMS)
│ ├── src/
│ │ ├── config/ # Conexión a MongoDB
│ │ ├── controllers/ # Controladores de rutas
│ │ ├── models/ # Modelos de Mongoose
│ │ ├── repositories/ # Lógica de acceso a datos
│ │ ├── routes/ # Endpoints de la API
│ │ └── app.js # Punto de entrada del servidor
│ ├── .env
│ └── package.json
│
└── player/ # Cliente Player (visualizador)
├── contenidoMultimedia/
│ └── videos/ # Archivos de video locales (.mp4)
├── index.html # Interfaz principal del Player
└── player.js # Lógica de reproducción


---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/ByronVega10/CarteleriaDigital.git
cd CarteleriaDigital/server

2️⃣ Instalar dependencias del servidor
npm install

3️⃣ Configurar variables de entorno
Crea un archivo .env dentro de server/ con el siguiente contenido:
MONGO_URI=mongodb://localhost:27017/carteleria
PORT=3000

(Si no tienes MongoDB, puedes instalarlo localmente o usar MongoDB Atlas.)

4️⃣ Ejecutar el servidor
npm run dev

Deberías ver en consola:
✅ Conectado a MongoDB Atlas
🚀 Servidor escuchando en http://localhost:3000


🎬 Reproducir videos en el Player

1️⃣ Asegúrate de tener tus videos en:
player/contenidoMultimedia/videos/

Por ejemplo:
player/multimediaContent/videos/video-1.mp4
player/multimediaContent/videos/video-2.mp4

2️⃣ Servir los videos desde Express
En server/src/app.js ya está configurado el acceso público a los videos locales:
app.use('/videos', express.static(path.join(__dirname, '../../player/multimediaContent/videos')));

Esto permite acceder a tus archivos en:
http://localhost:3000/videos/video-1.mp4


3️⃣ Registrar los videos en la base de datos (con Postman o curl)
Ejemplo de contenido JSON:
{
  "title": "Video Local 1",
  "fileUrl": "http://localhost:3000/videos/video1.mp4",
  "durationSec": 15,
  "assignedScreens": ["screen1"]
}

Envía un POST a:
http://localhost:3000/api/contents

Puedes usar Postman o el siguiente comando en terminal:
curl -X POST http://localhost:3000/api/contents \
-H "Content-Type: application/json" \
-d '{"title":"Video Local 1","fileUrl":"http://localhost:3000/videos/video1.mp4","durationSec":15,"assignedScreens":["screen1"]}'


4️⃣ Abrir el Player
Abre el archivo:
player/index.html

(o con Live Server en VSCode)

El Player consultará automáticamente la playlist desde:
http://localhost:3000/api/players/screen1/playlist


📡 Endpoints principales
Método	Ruta	Descripción
GET	/api/contents	Listar todos los contenidos
POST	/api/contents	Crear nuevo contenido
GET	/api/players/:id/playlist	Obtener playlist por pantalla


💡 Tecnologías utilizadas
Node.js + Express – Backend y API REST
MongoDB + Mongoose – Base de datos de contenidos
HTML + JavaScript – Player web
CORS, dotenv, morgan – Configuración y logging

🧑‍💻 Autor
Byron Vega
📍 Proyecto académico de cartelería digital
📦 Repositorio en GitHub

🖼️ Resultado esperado
Al abrir player/index.html (con el servidor corriendo):
El sistema muestra en pantalla completa los videos locales almacenados en player/contenidoMultimedia/videos/, reproduciéndolos de forma secuencial según la playlist registrada en MongoDB.
