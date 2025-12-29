const mongoose = require('mongoose');

const JobSeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  details: {
    headline: String,
    phone: String,
    linkedin: String,
    summary: String,
    experience: Array,
    education: Array,
    projects: Array,
    skills: {
      languages: String,
      frameworks: String,
      tools: String
    }
  },
  uploadedPortfolio: { type: String } // Path to the uploaded file
});

const RecruiterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyProfile: {
    name: String,
    website: String,
    location: String,
    about: String
  }
});

const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema);
const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

module.exports = { JobSeeker, Recruiter };