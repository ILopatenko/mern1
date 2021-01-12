//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import a middleware from middleware/auth.js
const auth = require('../../middleware/auth');

//Import a User model from models/User.js
const User = require('../../models/User');

//Import check and validatonResult from express-validator to make a different validation data. https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');

//Import JWT -work with web tokens
const jwt = require('jsonwebtoken');

//Import bcrypt - work with hash of passwords
const bcrypt = require('bcrypt');

//Import config data from config/default.json
const config = require('config');


router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})







// @route: POST => api/auth
// @desc: AUTHENTIFICATE user and get token
// @access: Public


router.post('/',
    [   //CHECKING BLOCK!
        check('email', 'Please use a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };

        const { email, password } = req.body;

        try {
            //Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

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