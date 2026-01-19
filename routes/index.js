const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const Registration = mongoose.model('Registration');

// Basic Auth setup 
const basic = auth.basic({
  realm: 'Authentication Required',
  file: path.join(__dirname, '../users.htpasswd')
});

// NOTE: Manual Basic Auth used due to http-auth hanging issue on Windows environment
function basicAuth(req, res, next) {
  const header = req.headers.authorization || '';

  // If no auth header, ask for credentials
  if (!header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return res.status(401).send('Authentication required.');
  }

  // Decode base64 username:password
  const base64 = header.split(' ')[1];
  const decoded = Buffer.from(base64, 'base64').toString('utf8');

  const [userRaw, passRaw] = decoded.split(':');
  const user = (userRaw || '').trim();
  const pass = (passRaw || '').trim();

  // Use the same credentials as that of users.htpasswd
  if (user === 'priya' && pass === 'password123') {
    return next();
  }

  // Wrong credentials check again
  res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
  return res.status(401).send('Invalid credentials.');
}

// GET form page
router.get('/', function(req, res) {
  res.render('form', { title: 'Registration form' });
});

router.post(
  '/',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),

    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email')
  ],
  function(req, res) {
    console.log(req.body);

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);

      registration.save()
        .then(() => {
          res.send('Thank you for your registration!');
        })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });

    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body
      });
    }
  }
);


// GET registrations page
router.get('/registrations', basicAuth, (req, res) => {

  Registration.find()
    .then((registrations) => {
      console.log('registrations found:', registrations.length);
      res.render('index', { title: 'Listing registrations', registrations });
    })
    //.catch(() => {
    .catch((err) => {
      console.log(err);
      res.status(500).send('Sorry! Something went wrong.');
    });
});


module.exports = router;