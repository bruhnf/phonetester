const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const authRouter = require('./routes/auth');
const testRouter = require('./routes/test');
const { handleCall } = require('./voice');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/phonetester')
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/?open=login');  // Redirect to home with login modal param
}

// Public routes (landing, signup, privacy, terms, verify-email from auth)
app.use('/', authRouter);

// Protected routes (test, start-test, status)
app.use('/', testRouter);
app.get('/test', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Webhook (public for Twilio)
app.post('/twilio-voice', handleCall);

// Additional public static pages
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// Future protected pages example:
// app.get('/future-page', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'future.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));