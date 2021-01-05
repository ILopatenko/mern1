//import express
const express = require('express');

//Initialize an express app
const app = express();

//Create a test route
app.get('/', (req, res) => res.send('API is running ...'))

//Set a port from process.env.PORT or 5000 if unavailable
const PORT = process.env.PORT || 5000;

//Start listener. Set a log to console if server started
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));