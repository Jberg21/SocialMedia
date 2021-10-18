const { User } = require('../models');

const userController = {

    // find ALL users
    getAllUsers(req, res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // find a single user by id *populate friends and thoughts*
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    // Create a new user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    // Update user by _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Delete user by id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => res.json({ message: 'This user was deleted!'}))
        .catch(err => res.json(err));
    },

    // add new friend to users list
    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $addToSet: {friends: params.friendId}},
            { new: true }
        )
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id found!'})
            }
            res.json(dbUserData);
        })
        .catch(err => {
            res.status(400).json(err);
        })
    },

    // remove friend from users list
    removeFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            {new: true, runValidators: true}
        )
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No friend found with this id!'});
                return;
            }
            res.json({ message: 'Friend has been removed!'})
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;