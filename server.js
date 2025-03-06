const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const nodeCron = require("node-cron");

const app = express();
const PORT = 3000;

app.use(cors());

const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Store file metadata with expiry timestamps
const filesData = {};

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    filesData[req.file.filename] = { expiryTime };

    res.json({
        success: true,
        fileUrl,
    });
});

// Middleware to check file expiry before serving
app.use("/uploads", (req, res, next) => {
    const fileName = path.basename(req.url);
    if (filesData[fileName] && Date.now() > filesData[fileName].expiryTime) {
        return res.status(403).send("Link Expired");
    }
    next();
}, express.static(uploadsDir));

// Auto-delete files every minute (files older than 30 mins)
nodeCron.schedule("* * * * *", () => {
    const now = Date.now();
    fs.readdir(uploadsDir, (err, files) => {
        if (err) return console.error("Error reading upload directory:", err);

        files.forEach((file) => {
            fs.stat(path.join(uploadsDir, file), (err, stats) => {
                if (err) return console.error("Error getting file stats:", err);

                if (now - stats.ctimeMs > 30 * 60 * 1000) { // 30 minutes expiry
                    fs.unlink(path.join(uploadsDir, file), (err) => {
                        if (err) console.error("Error deleting file:", err);
                        else console.log("Deleted:", file);
                    });
                }
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
