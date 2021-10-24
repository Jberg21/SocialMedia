const { User } = require('../models');

const userController = {

    // find users
    getAllUsers(req, res) {
        User.find({})
            .then(UserData => res.json(UserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // find a single user using id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
            .select('-__v')
            .then(UserData => res.json(UserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    // Create a new user
    createUser({ body }, res) {
        User.create(body)
        .then(UserData => res.json(UserData))
        .catch(err => res.json(err));
    },

    // Update user using ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(UserData => {
            if (!UserData) {
                res.status(404).json({ message: 'User not found with this id!'});
                return;
            }
            res.json(UserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Delete user using ID
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(UserData => res.json({ message: 'This user was deleted!'}))
        .catch(err => res.json(err));
    },

    // add a new friend to list
    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $addToSet: {friends: params.friendId}},
            { new: true }
        )
        .select('-__v')
        .then(UserData => {
            if(!UserData) {
                res.status(404).json({ message: 'No user with this id found!'})
            }
            res.json(UserData);
        })
        .catch(err => {
            res.status(400).json(err);
        })
    },

    // remove a friend
    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            {new: true, runValidators: true}
        )
        .select('-__v')
        .then(UserData => {
            if(!UserData) {
                res.status(404).json({ message: 'Friend no found with this id!'});
                return;
            }
            res.json({ message: 'This friend has been removed!'})
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;