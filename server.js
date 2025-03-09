const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const fileId = uuidv4();
        const fileExt = path.extname(file.originalname);
        const filename = `${fileId}${fileExt}`;
        cb(null, filename);
    }
});
const upload = multer({ storage });

// Store uploaded files metadata
const fileMetadata = {};

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const fileId = path.basename(req.file.filename, path.extname(req.file.filename));
    const filePath = req.file.path;
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store file metadata
    fileMetadata[fileId] = { filePath, expiryTime };

    res.json({ fileId });
});

// File access endpoint (expires after 10 minutes)
app.get("/file/:id", (req, res) => {
    const fileId = req.params.id;
    const fileData = fileMetadata[fileId];

    if (!fileData) {
        return res.status(404).send("File not found or expired.");
    }

    const uploadTime = fs.statSync(fileData.filePath).birthtimeMs;
    if (Date.now() - uploadTime > 10 * 60 * 1000) { // 10 minutes
        delete fileMetadata[fileId];
        return res.status(410).send("File link expired.");
    }

    res.download(fileData.filePath);
});

// Auto-delete files after 24 hours
cron.schedule("0 * * * *", () => {
    const now = Date.now();
    for (const fileId in fileMetadata) {
        if (fileMetadata[fileId].expiryTime < now) {
            fs.unlink(fileMetadata[fileId].filePath, (err) => {
                if (!err) {
                    console.log(`Deleted expired file: ${fileMetadata[fileId].filePath}`);
                }
            });
            delete fileMetadata[fileId];
        }
    }
});

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
