//import express
const express = require('express');

//Import connectDB module from config/db.js - will connect our express server to a database
const connectDB = require('./config/db');

//Initialize an express app
const app = express();

//Create a connection to database
connectDB();

//Create a test
app.get('/', (req, res) => res.send('API is running ...'))

//Set a port from process.env.PORT or 5000 if unavailable
const PORT = process.env.PORT || 5000;

//Start listener. Set a log to console if server started
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));