// Setup empty JS object to act as endpoint for all routes
projectData = {};


// Express to run server and routes
var express = require('express');

// Start up an instance of app
var app = express();

/* Dependencies */
const bodyParser = require('body-parser');
/* Middleware */

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 5501;
// Callback to debug
const server = app.listen(port, listening);
// Initialize all route with a callback function
function listening(){
    console.log('Server is running');
    console.log(`running on port ${port}`);
}

const entryData = [];
app.get('/all', getEntry);

// Callback function to complete GET '/all'
function getEntry(req, res){
    res.send(entryData);
}

// Post Route
app.post('/entryData', postEntry);

function postEntry(req, res){

    newEntry = {
        date: req.body.date,
        temperature: req.body.temp,
        mood: req.body.mood,
    }
    entryData.push(newEntry);
    res.send(entryData);
}