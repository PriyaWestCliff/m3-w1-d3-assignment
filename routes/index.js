const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

router.get('/test', function (req, res) {
  res.send('It works!');
});

// GET form page
router.get('/', function (req, res) {
  res.render('form', {
    title: 'Registration Form',
    errors: [],
    values: { name: '', email: '' }
  });
});

//  put validators BEFORE the callback
router.post(
  '/',
  [
    check('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters.'),

    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address.')
  ],
  function (req, res) {
    console.log(req.body);

    // validationResult
    const result = validationResult(req);

    const errors = result.array().map(err => err.msg);

    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();

    if (errors.length > 0) {
      return res.status(400).render('form', {
        title: 'Registration Form',
        errors,                 
        values: { name, email } 
      });
    }

    return res.render('success', {
      title: 'Success',
      name,
      email
    });

    /*if (errors.isEmpty()) {
    //  res.send('Thank you for your registration!');
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });*/
  }
);

module.exports = router;
