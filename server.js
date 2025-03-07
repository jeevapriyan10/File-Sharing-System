const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static("public"));

// Create "uploads" directory if it doesn’t exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: "File upload failed" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl });

    // Auto-delete file after 30 minutes
    setTimeout(() => {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
            else console.log(`Deleted file: ${req.file.filename}`);
        });
    }, 30 * 60 * 1000); // 30 mins
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
