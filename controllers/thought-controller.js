const { Thought, User } = require('../models');

const thoughtController = {

    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => {
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // Get single thougth by ID
    getThoughtById({ params }, res) {
        Thought.findOne({_id: params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // Create a new thought
    createThought({body}, res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: {thoughts: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this ID'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Add a new reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: {reactions: body} },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },


    // update a thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // Delete a thought by Id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => res.json({ message: 'This thought is gone!'}))
        .catch(err => res.status(400).json(err));
    },

    
    // Delete a reaction to a thought
    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: {reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => res.json({ message: 'No more reaction!'}))
        .catch(err => res.json(err));
    }


};

module.exports = thoughtController;