const express = require('express');
const db = require('./db/config');
const route = require('./controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5001;

const fs = require('fs');
const path = require('path');
const job = require('./cron');

// Setup Express App
const app = express();

// Middleware
app.use(bodyParser.json());

// Set up CORS
app.use(cors());

// Serve React static files from the build folder (if in production)


// API Routes
app.get('/api/health-check', async (req, res) => {
    res.status(200).send("Server healthy!!");
});

app.use('/api', route);
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    console.log("0011")
    console.log(path.join(__dirname, '../client', 'build'))
    app.use(express.static(path.join(__dirname, '../client', 'build')));

    // Handle all GET requests to serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
    });
} else {
    // For development or non-production environments, React will handle serving its own static files.
    app.get('/', (req, res) => {
        res.send('Development Mode: React client should be served by the dev server.');
    });
}

// Get port from environment and store in Express.
const server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === true || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    console.log(`Server listening at ${protocol}://${host}:${port}/`);
});

// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017';
const DATABASE = process.env.DB || 'Prolink';

db(DATABASE_URL, DATABASE);

// Run cron job
job();
