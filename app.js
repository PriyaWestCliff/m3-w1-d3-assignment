const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();

// Read POST form data
/*app.use(express.urlencoded({ extended: false }));*/
app.use(bodyParser.urlencoded({ extended: false }));

// Static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Pug view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use('/', routes);

module.exports = app;
