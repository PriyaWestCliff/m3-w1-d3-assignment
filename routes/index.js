const express = require('express');
const mongoose = require('mongoose');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const Registration = mongoose.model('Registration');

const basic = auth.basic(
  { realm: 'Authentication Required' },
  (username, password, callback) => {
    callback(username === 'admin' && password === 'password');
  }
);

router.get('/', function (req, res) {
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
  function (req, res) {
    console.log(req.body);

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);

      registration
        .save()
        .then(() => {
          console.log('✅ Saved to MongoDB');
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

router.get('/registrations', basic.check(), (req, res) => {
  console.log('✅ /registrations route hit');
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => {
      res.send('Sorry! Something went wrong.');
    });
});

module.exports = router;
