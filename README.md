Node.js File Sharing System

Overview

This project is a secure file-sharing system built with Node.js. Users can upload files and receive a unique sharing link that automatically expires after 10 minutes. The uploaded file remains available for 24 hours before being deleted.

Features

Upload files and receive a unique sharing link.

Sharing links expire after 10 minutes.

Files are automatically deleted after 24 hours.

Frontend built with HTML, CSS, and JavaScript.

Backend developed using Node.js and Express.

Technologies Used

Backend: Node.js, Express.js, Multer (for file uploads)

Database: MongoDB (or local storage option)

Frontend: HTML, CSS, JavaScript

Hosting: GitHub (for frontend), Render/Heroku (for backend deployment)

Project Structure

📁 nodejs-file-sharing
 ├── 📂 public       # Frontend files (HTML, CSS, JS)
 ├── 📂 uploads      # Temporary file storage
 ├── 📂 routes       # API routes for file upload & sharing
 ├── 📂 models       # Database models
 ├── server.js      # Main server file
 ├── package.json   # Project dependencies
 ├── .gitignore     # Ignore unnecessary files
 └── README.md      # Project documentation

Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/nodejs-file-sharing.git
cd nodejs-file-sharing

Install dependencies:

npm install

Run the server:

node server.js

Access the project in your browser at http://localhost:3000

Security Measures

File validation to prevent malicious uploads.

Automatic deletion of expired files.

Environment variables for sensitive data.

Contributions

Contributions are welcome. If you would like to contribute:

Fork the repository.

Create a new branch.

Make your changes and commit them.

Open a pull request for review.

License

This project is licensed under the MIT License. See the LICENSE file for details.

