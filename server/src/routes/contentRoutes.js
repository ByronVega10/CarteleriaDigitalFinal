const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg"); // ← Para extraer duración real
const { createContent, getAllContents, deleteContent } = require("../repositories/contentRepository");
const router = express.Router();
const BASE_URL = process.env.BASE_URL || "https://carteleriadigitalfinal.onrender.com";

// ================= STORAGE & MULTER =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../player/multimediaContent/videos'));
    },
    filename(req, file, cb) {
        const safeName = file.originalname.replace(/[^\w.-]/g, "_");
        const uniqueName = Date.now() + "-" + safeName;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4)$/i)) {
            return cb(new Error("Solo se permiten archivos MP4"));
        }
        cb(null, true);
    }
});

// ================= GET ALL =================
router.get("/", async (req, res) => {
    try {
        const contents = await getAllContents();
        res.json(contents);
    } catch (err) {
        res.status(500).json({ message: "Error obteniendo contenidos" });
    }
});

// ================= UPLOAD + METADATA =================
router.post("/upload", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se subió ningún archivo o no es un MP4" });
        }

        const videoPath = path.join(
            __dirname,
            "../../../player/multimediaContent/videos",
            req.file.filename
        );

        // Obtener duración real del video
        ffmpeg.ffprobe(videoPath, async (err, metadata) => {
            if (err) {
                console.error("Error leyendo metadata:", err);
                return res.status(500).json({ message: "Error leyendo metadata del video" });
            }

            const duration = Math.floor(metadata.format.duration);

            const newContent = await createContent({
                title: req.body.title || req.file.originalname,
                fileUrl: `${BASE_URL}/videos/${req.file.filename}`,
                durationSec: duration,
                assignedScreens: [],
                scheduled: new Date()
            });

            return res.status(201).json({
                message: "Video subido y contenido creado",
                file: req.file.filename,
                duration: duration,
                content: newContent
            });
        });

    } catch (error) {
        console.error("ERROR UPLOAD:", error);

        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: "Error en la subida", error });
        }

        res.status(500).json({ message: "Error al subir archivo", error });
    }
});

// ================= DELETE =================
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const deleted = await deleteContent(id);

        if (!deleted) {
            return res.status(404).json({ message: "Contenido no encontrado" });
        }

        res.json({ message: "Contenido eliminado", deleted });

    } catch (error) {
        console.error("ERROR ELIMINANDO:", error);
        res.status(500).json({ message: "Error interno", error });
    }
});

module.exports = router;