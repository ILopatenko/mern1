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

//Import check and validatonResult from express-validator to make a different validation data. https://express-validator.github.io/docs/
const {check, validationResult} = require('express-validator');


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: GET => api/profile/me
// @desc: Get profile of current logged in user
// @access: Private
router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        };
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    };
}
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: POST => api/profile
// @desc: CREATE or UPDATE user profile
// @access: Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    };
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build a profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    };

    //Build a social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){

            //UPDATE a profile
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields}, 
                {new: true}
            );
            return res.json(profile);
        };

        //CREATE a profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    };
}
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: GET => api/profile
// @desc: Get all the profiles
// @access: Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: GET => api/profile/user/:user_id
// @desc: Get profile by ID [:user_id]
// @access: Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg: 'Profile is not found'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({msg: 'Profile is not found'});
        }
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports = router;