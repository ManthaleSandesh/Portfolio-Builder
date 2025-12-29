const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { JobSeeker, Recruiter } = require('./models');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/portfolioApp')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));
// File Upload Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// Job Seeker Register
app.post('/api/jobseeker/register', async (req, res) => {
  try {
    const newSeeker = new JobSeeker(req.body);
    await newSeeker.save();
    res.status(201).json({ message: "Registered successfully", user: newSeeker });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Seeker Login
app.post('/api/jobseeker/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await JobSeeker.findOne({ email, password });
    if (user) res.json({ message: "Login successful", user });
    else res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Portfolio Data (Text)
app.post('/api/jobseeker/update', async (req, res) => {
  try {
    const { email, details } = req.body;
    await JobSeeker.findOneAndUpdate({ email }, { details }, { new: true });
    res.json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Portfolio File (PDF/Doc)
app.post('/api/jobseeker/upload-portfolio', upload.single('portfolioFile'), async (req, res) => {
  try {
    const email = req.body.email;
    const filePath = req.file.path;
    await JobSeeker.findOneAndUpdate({ email }, { uploadedPortfolio: filePath });
    res.json({ message: "File uploaded successfully", path: filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recruiter Login
app.post('/api/recruiter/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Auto-register for demo purposes if not exists
    let recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      recruiter = new Recruiter({ email, password });
      await recruiter.save();
    }
    if (recruiter.password === password) res.json({ message: "Login successful", user: recruiter });
    else res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Candidates (For Recruiter)
app.get('/api/recruiters/candidates', async (req, res) => {
  try {
    const candidates = await JobSeeker.find({});
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));