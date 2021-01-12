//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import GRAVATAR package - work with avatars
const gravatar = require('gravatar');

//Import bcrypt - work with hash of passwords
const bcrypt = require('bcrypt');

//Import JWT -work with web tokens
const jwt = require('jsonwebtoken');

//Import config data from config/default.json
const config = require('config');

//Import check and validatonResult from express-validator to make a different validation data. https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');

//Import a User model from models/User.js
const User = require('../../models/User');

// @route: POST => api/users
// @desc: Register a new user 
// @access: Public

router.post('/',
    [   //CHECKING BLOCK!
        check('name', 'Name is requared').not().isEmpty(),
        check('email', 'Please use a valid email').isEmail(),
        check('password', 'Password should be at least 6 character').isLength({ min: 5 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

        const { name, email, password } = req.body;

        try {
            //Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User is already exists' }] });
            }

            //Get user's gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            //Create a new instance of USER
            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Create a HASH of password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //Save a new USER to a database
            await user.save();

            //Encrypt a password

            //Return a jsonwebtoken

            //res.send('User registered!');

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 10000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;