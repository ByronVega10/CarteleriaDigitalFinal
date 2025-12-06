// player/player.js
async function fetchPlaylist() {
  const res = await fetch('http://localhost:3000/api/players/screen1/playlist');
  const playlist = await res.json();
  playMedia(playlist);
}

function playMedia(list) {
  const video = document.getElementById('player');
  let index = 0;

  function next() {
    const item = list[index];
    video.src = item.url;
    video.play();
    setTimeout(() => {
      index = (index + 1) % list.length;
      next();
    }, item.duration * 1000);
  }

  next();
}

fetchPlaylist();
setInterval(fetchPlaylist, 60000); // Actualiza cada minuto