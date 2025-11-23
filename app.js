const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve all files in main folder


// =====================
// Data Folder on D Drive
// =====================
const dataFolder = 'D:/AI_LMS_Data';
const uploadsFolder = path.join(dataFolder, 'uploads');

if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder);

const enrollFile = path.join(dataFolder, 'enrollments.json');
const feedbackFile = path.join(dataFolder, 'feedback.json');

// Multer for lecture uploads
const upload = multer({ dest: uploadsFolder });

// Helper to save JSON data
function saveToFile(file, data) {
    let arr = [];
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content) arr = JSON.parse(content);
    }
    arr.push(data);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

// =====================
// Routes for Forms
// =====================
app.post('/enroll', (req, res) => {
    const { name, email, course } = req.body;
    if (name && email && course) {
        saveToFile(enrollFile, { name, email, course, date: new Date() });
        res.json({ message: `Thank you ${name}, you are enrolled in ${course}!` });
    } else res.status(400).json({ message: 'Please fill all fields!' });
});

app.post('/feedback', (req, res) => {
    const { name, email, message } = req.body;
    if (name && email && message) {
        saveToFile(feedbackFile, { name, email, message, date: new Date() });
        res.json({ message: `Thank you for your feedback, ${name}!` });
    } else res.status(400).json({ message: 'Please fill all fields!' });
});

app.post('/uploadLecture', upload.single('lectureFile'), (req, res) => {
    if (req.file && req.body.title) {
        res.json({ message: `Lecture "${req.body.title}" uploaded successfully.` });
    } else {
        res.status(400).json({ message: 'Missing file or title.' });
    }
});

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Enrollments stored at:', enrollFile);
    console.log('Feedback stored at:', feedbackFile);
    console.log('Lecture uploads stored at:', uploadsFolder);
});
