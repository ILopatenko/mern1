//import express
const express = require('express');

//Import connectDB module from config/db.js - will connect our express server to a database
const connectDB = require('./config/db');

//Initialize an express app
const app = express();

//Create a connection to database
connectDB();

//Init a middleware
app.use(express.json({ extended: false }));

//Create a test route with a response
app.get('/', (req, res) => res.send('API is running ...'));

//Create a test routes to all essential funtionality
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Set a port from process.env.PORT or 5000 if unavailable
const PORT = process.env.PORT || 5000;

//Start listener. Set a log to console if server started
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));