const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    jobstatus: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    bio: {
        type: String,
    },
    phone: {
        type: String,
    },
    ghbname: {
        type: String,
    },
    expirience: [
        {
            title: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            },
            current: {
                type: Boolean,
                default: false,
            },
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true,
            },
            degree: {
                type: String,
                required: true,
            },
            fieldofstudy: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            },
            current: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
            },
        }
    ],
    sociallinks: {
        google: {
            type: String,
        },
        facebook: {
            type: String,
        },
        twitter: {
            type: String,
        },
        instagram: {
             type: String,
        },
        linkedin: {
             type: String,
        },
    },
    date: {
        type: Date,
        default: Date.now,
    }
   
});

module.exports = Profile = mongoose.model('user', UserSchema);