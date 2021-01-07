//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import a middleware from middleware/auth.js
const auth = require('../../middleware/auth');

//Import a User model from models/User.js
const User = require('../../models/User');

//Import a User model from models/User.js
const Profile = require('../../models/Profile');



// @route: GET => api/profile/me
// @desc: Get profile of current logged in user
// @access: Private

router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});






module.exports = router;