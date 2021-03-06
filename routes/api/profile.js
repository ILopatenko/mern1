//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import a middleware from middleware/auth.js
const auth = require('../../middleware/auth');

//Import a User model from models/User.js
const User = require('../../models/User');

//Import a Profile model from models/Profile.js
const Profile = require('../../models/Profile');

//Import check and validatonResult from express-validator to make a different validation data. https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');

//Import request
const request = require('request');

//Import config
const config = require('config');
const { response } = require('express');



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: GET => api/profile/me
// @desc: Get profile of current logged in user
// @access: Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        };
        res.json(profile);
    } catch (err) {
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
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

    //Build a social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {

            //UPDATE a profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        };

        //CREATE a profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
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
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile is not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile is not found' });
        }
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: DELETE => api/profile
// @desc: DELETE user, profile and all the posts
// @access: Private
router.delete('/', auth, async (req, res) => {
    try {

        //REMOVE ALL THE POSTS
        //await Post.deleteMany({ user: req.user.id });

        //REMOVE PROFILE
        await Profile.findOneAndRemove({ user: req.user.id });

        //REMOVE USER
        await User.findOneAndRemove({ _id: req.user.id });


        res.json({ msg: 'USER deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: PUT => api/profile/experience
// @desc: ADD profile EXPERIENCE
// @access: Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ]],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        };

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        try {

            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        };
    }
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: DELETE => api/profile/experience/:exp_id
// @desc: DELETE experience
// @access: Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        //Get a profile of current user from database by ID
        const profile = await Profile.findOne({ user: req.user.id });
        //FIND remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        //REMOVE experience with index from previous step
        profile.experience.splice(removeIndex, 1);

        //Save the changes
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: PUT => api/profile/education
// @desc: ADD profile EDUCATION
// @access: Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ]],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        };

        const {
            school,
            degree,
            fieldofstudy,
            from
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from
        };

        try {

            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        };
    }
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: DELETE => api/profile/education/:edu_id
// @desc: DELETE education
// @access: Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        //Get a profile of current user from database by ID
        const profile = await Profile.findOne({ user: req.user.id });
        //FIND remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        //REMOVE education with index from previous step
        profile.education.splice(removeIndex, 1);

        //Save the changes
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route: GET => api/profile/github/:username
// @desc: GET user repos from GitHub
// @access: Public






//NEWONE
router.get('/github/:username', auth, async (req, res) => {

    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('gihubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js ' }
        };
        request(options, (error, responce, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'GitHub profile is not found' });
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports = router;