const { Schema, model } = require('mongoose');
// const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Username Required!',
            trim: true
        },
        email: {
            type: String,
            required: 'Email required!',
            unique: true,
            validate: {
                validator: function (email) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
                },
                message: "Please enter a valid email"
            }
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length
});

const User = model('User', UserSchema);

module.exports = User;