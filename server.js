const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------- MIDDLEWARE ----------------------- //
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // serve HTML, CSS, JS, images

// ----------------------- JSON FILES ----------------------- //
const usersFile = path.join(__dirname, 'lms_users.json');
const lecturesFile = path.join(__dirname, 'lms_lectures.json');
const enrollmentsFile = path.join(__dirname, 'lms_enrollments.json');
const feedbackFile = path.join(__dirname, 'lms_feedback.json');

// Initialize files if not exist
[usersFile, lecturesFile, enrollmentsFile, feedbackFile].forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
});

// ----------------------- HELPER FUNCTIONS ----------------------- //
const getData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ----------------------- USERS ----------------------- //
// Signup
app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  const users = getData(usersFile);

  if (users.find(u => u.email === email)) {
    return res.json({ success: false, message: "❌ Email already exists!" });
  }

  users.push({ id: Date.now(), name, email, password, role });
  saveData(usersFile, users);
  res.json({ success: true, message: "✅ Signup successful!" });
});

// Login
app.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const users = getData(usersFile);
  const user = users.find(u => u.email === email && u.password === password && u.role === role);

  if (!user) return res.json({ success: false, message: "❌ Invalid credentials!" });

  res.json({ success: true, user });
});

// Optional: get all users
app.get('/users', (req, res) => res.json(getData(usersFile)));

// ----------------------- LECTURES ----------------------- //
app.post('/lecture', (req, res) => {
  const { title, filename } = req.body;
  if (!title || !filename) return res.status(400).json({ message: 'Missing title or file' });

  const lectures = getData(lecturesFile);
  lectures.push({ id: Date.now(), title, filename });
  saveData(lecturesFile, lectures);
  res.json({ message: 'Lecture added!' });
});

// ----------------------- ENROLLMENTS ----------------------- //
app.post('/enroll', (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) return res.status(400).json({ message: 'Missing fields' });

  const enrollments = getData(enrollmentsFile);
  enrollments.push({ id: Date.now(), name, email, course });
  saveData(enrollmentsFile, enrollments);
  res.json({ message: 'Enrollment saved!' });
});

// ----------------------- FEEDBACK ----------------------- //
app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });

  const feedbacks = getData(feedbackFile);
  feedbacks.push({ id: Date.now(), name, email, message });
  saveData(feedbackFile, feedbacks);
  res.json({ message: 'Feedback saved!' });
});

// ----------------------- FETCH ALL DATA ----------------------- //
app.get('/data', (req, res) => {
  res.json({
    lectures: getData(lecturesFile),
    enrollments: getData(enrollmentsFile),
    feedbacks: getData(feedbackFile)
  });
});

// ----------------------- START SERVER ----------------------- //
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
