const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  // For parsing incoming JSON requests
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, 'frontend')));  // Serve static files from 'frontend'

// Default route to serve the index.html (landing page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html', 'index.html'));  // Serve 'index.html' from the 'html' folder
});

// Serve login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html', 'login.html'));  // Serve 'login.html'
});

// Serve register.html
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html', 'register.html'));  // Serve 'register.html'
});

// Serve main.html
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html', 'main.html'));  // Serve 'main.html'
});

// POST route to handle user registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // For now, just sending a success message
    res.status(201).json({ message: 'User registered successfully' });
});

// Set the port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Frontend is running on http://localhost:${PORT}`);
});