//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import check and validatonResult from express-validator to make a different validation data. https://express-validator.github.io/docs/
const {check, validationResult} = require('express-validator');

// @route: POST => api/users
// @desc: Register a new user
// @access: Public
router.post('/', 
[
    check('name', 'Name is requared').not().isEmpty(),
    check('email', 'Please use a valid email').isEmail(),
    check('password', 'Password should be at least 6 character').isLength({min: 6})
], 
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    };
    res.send('Looks like all the data at request is totally good!');
});

module.exports = router;