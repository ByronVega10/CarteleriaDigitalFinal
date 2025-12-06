// CONFIG - Cambia this to your deployed server URL (https)
const SERVER_URL = "https://carteleriadigitalfinal.onrender.com";
const POLL_INTERVAL = 15000; // 15s

let screenInfo = JSON.parse(localStorage.getItem('screenInfo') || 'null');
let currentPlaylistId = null;
let playlistVideos = [];
let currentIndex = 0;

const videoEl = document.getElementById('video');
const overlay = document.getElementById('overlay');

async function registerIfNeeded() {
  if (screenInfo && screenInfo.id) return;
  // registrarse en el servidor
  const name = prompt('Nombre de la pantalla (ej: Sala 1)') || 'Pantalla';
  try {
    const res = await fetch(`${SERVER_URL}/api/screens/register`, {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('No se pudo registrar');
    screenInfo = await res.json(); // { id, token }
    localStorage.setItem('screenInfo', JSON.stringify(screenInfo));
  } catch (err) {
    console.error('Error registrando pantalla', err);
    overlay.innerText = 'Error registrando pantalla';
  }
}

async function pollPlaylist() {
  if (!screenInfo || !screenInfo.id) return;
  try {
    const res = await fetch(`${SERVER_URL}/api/screens/${screenInfo.id}/playlist`);
    if (!res.ok) {
      console.warn('pollPlaylist not ok', res.status);
      overlay.innerText = `Conexión err ${res.status}`;
      return;
    }
    const data = await res.json(); // { playlist, screenStatus }
    const playlist = data.playlist;
    if (!playlist) {
      overlay.innerText = 'Sin playlist asignada';
      playlistVideos = [];
      videoEl.pause();
      videoEl.src = '';
      return;
    }
    if (playlist._id !== currentPlaylistId) {
      currentPlaylistId = playlist._id;
      // normalizar videos (ajusta según tu campo)
      playlistVideos = (playlist.videos || []).map(v => ({
        url: v.fileUrl || v.videoUrl || (v.filename ? `/videos/${v.filename}` : ''),
        title: v.title || v.name || 'Video'
      }));
      currentIndex = 0;
      playCurrent();
    }
  } catch (err) {
    console.error('Error polling playlist', err);
    overlay.innerText = 'Error conectando servidor';
  }
}

function playCurrent() {
  if (!playlistVideos.length) {
    overlay.innerText = 'No hay contenido';
    videoEl.pause();
    videoEl.src = '';
    return;
  }
  const item = playlistVideos[currentIndex];
  overlay.innerText = `Reproduciendo: ${item.title}`;
  videoEl.src = item.url;
  // algunos navegadores no allow autoplay unless muted -> estamos en muted
  videoEl.play().catch(e => {
    console.warn('Play error', e);
  });
}

videoEl.addEventListener('ended', () => {
  currentIndex++;
  if (currentIndex >= playlistVideos.length) currentIndex = 0;
  playCurrent();
});

async function sendHeartbeat(){
  if (!screenInfo || !screenInfo.id) return;
  try {
    await fetch(`${SERVER_URL}/api/screens/${screenInfo.id}/heartbeat`, { method: 'POST' });
  } catch (e) {
    // no importa
  }
}

(async () => {
  overlay.innerText = 'Registrando pantalla...';
  await registerIfNeeded();
  overlay.innerText = 'Sin playlist asignada';
  await pollPlaylist();
  sendHeartbeat();
  setInterval(pollPlaylist, POLL_INTERVAL);
  setInterval(sendHeartbeat, 30000);
})();