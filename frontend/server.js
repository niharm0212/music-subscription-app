const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '')));

// Default route to serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure the correct path
});

// Use another port (for example, 8000)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Frontend is running on http://localhost:${PORT}`);
});