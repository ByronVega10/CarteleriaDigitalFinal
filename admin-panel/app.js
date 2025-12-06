/* app.js */


// ================= LOGIN =================
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Debe ingresar correo y contraseña");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.status === 200) {
            alert("Login exitoso");
            window.location.href = "home.html";
        } else {
            alert(data.msg);
        }

    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}


// ================= CONTENIDO =================

// LOAD CONTENIDO
async function loadContenido() {
    try {
        const res = await fetch("http://localhost:3000/api/contents");

        // 🔥 Esto se ejecuta SIEMPRE: carga global de contenidos
        contenidos = await res.json();

        // Si existe la tabla (solo en contenido.html), la rellenamos
        const tabla = document.getElementById("contenido-list");
        if (tabla) {
            tabla.innerHTML = "";

            contenidos.forEach(item => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${item.title || "(sin título)"}</td>
                    <td>${item.fileUrl?.split('.').pop() || "desconocido"}</td>
                    <td>
                        <button onclick="verVideo('${item.fileUrl}')">Ver</button>
                        <button onclick="eliminarContenido('${item._id}')">Eliminar</button>
                    </td>
                `;

                tabla.appendChild(fila);
            });
        }

    } catch (error) {
        console.error("Error cargando contenidos:", error);
    }
}

//VER VIDEO
function verVideo(url) {
    if (!url) return alert("Este contenido no tiene archivo asociado.");
    window.open(url, "_blank");
}


//SUBIR VIDEO
async function subirVideo() {

    console.log(">>> subirVideo() fue llamada");  // ← AGREGAR ESTO AQUÍ

    const title = document.getElementById("videoTitle").value;
    const file = document.getElementById("videoFile").files[0];

    if (!file) {
        alert("Debe seleccionar un archivo MP4");
        return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
        const res = await fetch("http://localhost:3000/api/contents/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.status === 201) {
            alert("Video subido correctamente");
            loadContenido();
        } else {
            alert("Error: " + data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Error subiendo video");
    }
}

// ELIMINAR CONTENIDO
async function eliminarContenido(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este contenido?");
    if (!confirmar) return;

    try {
        const res = await fetch(`http://localhost:3000/api/contents/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("Respuesta DELETE:", data);  // ← para ver lo que responde backend

        if (res.status === 200) {
            alert("Contenido eliminado correctamente");
            loadContenido();   // ← recarga la tabla
        } else {
            alert("No se pudo eliminar: " + (data.message || "Error desconocido"));
        }

    } catch (error) {
        console.error("Error al eliminar contenido:", error);
        alert("Error eliminando contenido");
    }
}

// ================= PLAYLIST =================
let playlists = [];
let contenidos = []; 
let tempPlaylist = { name: "", videos: [] };

// Cargar lista de playlist
document.addEventListener("DOMContentLoaded", async () => {

    // Cargar contenido solo si existe tabla
    if (document.getElementById("contenido-list")) {
        await loadContenido();
    }

    // Cargar playlists solo si existe tabla de playlists
    if (document.getElementById("playlist-list")) {
        await loadPlaylists();
        await loadContenido(); 
    }
});

// cargar playlists reales
async function loadPlaylists() {
    try {
        const res = await fetch("http://localhost:3000/api/playlists");
        playlists = await res.json();

        renderPlaylists();
    } catch (err) {
        console.error("Error cargando playlists:", err);
    }
}

// Renderizar playlists reales
function renderPlaylists() {
    const tbody = document.getElementById("playlist-list");
    if (!tbody) return;

    tbody.innerHTML = "";

    playlists.forEach(pl => {
        tbody.innerHTML += `
            <tr>
                <td>${pl.name}</td>
                <td>${pl.videos.length}</td>
                <td>
                    <button onclick="openEditPlaylist('${pl._id}')">Editar</button>
                    <button onclick="deletePlaylist('${pl._id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}


function openPlaylistModal() {
    document.getElementById("playlistModal").classList.remove("hidden");
}

function closePlaylistModal() {
    document.getElementById("playlistModal").classList.add("hidden");
}

function createPlaylist() {
    const name = document.getElementById("playlistName").value.trim();
    if (!name) return alert("Ingrese un nombre");

    tempPlaylist = { name, videos: [] };

    closePlaylistModal();
    openVideosModal();
}

function openVideosModal() {
    document.getElementById("playlistVideosModal").classList.remove("hidden");

    const container = document.getElementById("videosCheckboxList");
    container.innerHTML = "";

    contenidos.forEach(c => {
        container.innerHTML += `
            <label>
                <input type="checkbox" value="${c._id}">
                ${c.title || "Sin nombre"}
            </label><br>
        `;
    });
}

function closeVideosModal() {
    document.getElementById("playlistVideosModal").classList.add("hidden");
}

async function savePlaylistVideos() {
    const checks = document.querySelectorAll("#videosCheckboxList input:checked");

    tempPlaylist.videos = Array.from(checks).map(c => c.value);

    if (tempPlaylist.videos.length === 0) {
        return alert("Debe seleccionar al menos 1 video");
    }

    try {
        const res = await fetch("http://localhost:3000/api/playlists", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(tempPlaylist)
        });

        if (!res.ok) {
            return alert("Error creando playlist");
        }

        const newPL = await res.json();
        playlists.push(newPL);

        closeVideosModal();
        renderPlaylists();

        alert("Playlist creada correctamente");

    } catch (err) {
        console.error("Error guardando playlist:", err);
    }
}

let playlistBeingEdited = null;

// EDITAR PLAYLIST
async function openEditPlaylist(id) {
    // Guardamos la playlist que estamos editando
    playlistBeingEdited = playlists.find(p => p._id === id);

    if (!playlistBeingEdited) {
        return alert("Error: No se encontró la playlist.");
    }

    // Mostrar modal
    document.getElementById("editPlaylistModal").classList.remove("hidden");

    // Rellenar campo nombre
    document.getElementById("editPlaylistName").value = playlistBeingEdited.name;

    // Generar lista de videos
    const container = document.getElementById("editVideosCheckboxList");
    container.innerHTML = "";

    contenidos.forEach(video => {
        const checked = playlistBeingEdited.videos.some(v => v._id === video._id);

        container.innerHTML += `
            <label>
                <input type="checkbox" value="${video._id}" ${checked ? "checked" : ""}>
                ${video.title || "Sin título"}
            </label><br>
        `;
    });
}
//GUARDAR PLAYLIST EDITADA
async function saveEditedPlaylist() {
    const newName = document.getElementById("editPlaylistName").value.trim();

    if (!newName) {
        return alert("Debe ingresar un nombre");
    }

    // Obtener videos seleccionados
    const checks = document.querySelectorAll("#editVideosCheckboxList input:checked");
    const selectedVideos = Array.from(checks).map(c => c.value);

    try {
        const res = await fetch(`http://localhost:3000/api/playlists/${playlistBeingEdited._id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: newName,
                videos: selectedVideos
            })
        });

        if (!res.ok) {
            return alert("Error actualizando playlist");
        }

        const updatedPL = await res.json();

        // Reemplazar playlist actualizada en la lista
        const index = playlists.findIndex(p => p._id === updatedPL._id);
        playlists[index] = updatedPL;

        renderPlaylists();
        closeEditPlaylistModal();

        alert("Playlist actualizada correctamente");

    } catch (error) {
        console.error("Error al actualizar playlist:", error);
    }
}

function closeEditPlaylistModal() {
    document.getElementById("editPlaylistModal").classList.add("hidden");
}

// ================= PANTALLAS =================
document.addEventListener("DOMContentLoaded", () => {
    const pantallas = document.getElementById("pantallas-list");
    if (pantallas) {
        pantallas.innerHTML = `
            <tr>
                <td>Pantalla 1</td>
                <td style="color: green; font-weight: bold">Online</td>
                <td>12:30</td>
                <td><button>Detalles</button></td>
            </tr>
        `;
    }
});
// DELETE PLAYLIST
async function deletePlaylist(id) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta playlist?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`http://localhost:3000/api/playlists/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            return alert("Error eliminando playlist");
        }

        // Quitar de la lista local
        playlists = playlists.filter(pl => pl._id !== id);

        // Actualizar tabla
        renderPlaylists();

        alert("Playlist eliminada correctamente");

    } catch (error) {
        console.error("Error al eliminar playlist:", error);
    }
}

// ================= PROGRAMACIÓN =================
document.addEventListener("DOMContentLoaded", () => {
    const selectPantalla = document.getElementById("selectPantalla");
    const selectPlaylist = document.getElementById("selectPlaylist");


    if (selectPantalla) {
        selectPantalla.innerHTML = `
            <option value="1">Pantalla 1</option>
        `;
    }


    if (selectPlaylist) {
        selectPlaylist.innerHTML = `
            <option value="principal">Playlist Principal</option>
        `;
    }


    const tabla = document.getElementById("programacion-list");
    if (tabla) {
        tabla.innerHTML = `
            <tr>
                <td>Pantalla 1</td>
                <td>Playlist Principal</td>
                <td><button>Cambiar</button></td>
            </tr>
        `;
    }
});


function assignPlaylist() {
    const pantalla = document.getElementById("selectPantalla").value;
    const playlist = document.getElementById("selectPlaylist").value;

    alert(`Asignada la playlist ${playlist} a la pantalla ${pantalla}`);
}