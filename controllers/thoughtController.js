const { Thought, User } = require("../models");

const thoughtController = {
  //get all
  getAllThought(req, res) {
    Thought.find()
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
  },
  //id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select("-__v")
      .then((thought) => 
      !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : res.json(thought)
    )
    .catch((err) => res.status(500).json(err)); 
  },

  // create Thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
        ? res.json({ message: "Thought created but no user with this id!" })
        : res.json({ message: "Thought successfully created!" })
        )
      .catch((err) => res.status(500).json(err)); 
  },

  // update thought 
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((thought) => 
    !thought
    ? res.status(404).json({ message: 'No thought with this id!' })
    : res.json(thought)
        )
    .catch((err) => res.status(500).json(err)); 
  },

  // delete Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) => 
      !thought
      ? res.status(404).json({ message: 'No thought with that ID' })
      : User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } }, 
        { new: true }
      ))

      .then((user) => 
        !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json({ message: "Thought successfully deleted!" }))
      .catch((err) => res.status(500).json(err));
  },

  // add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then((thought) => 
    !thought
    ? res.status(404).json({ message: 'No thought with this id!' })
    : res.json(thought)
        )
    .catch((err) => res.status(500).json(err)); 
  },

  // delete reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
    .then((thought) => 
    !thought
    ? res.status(404).json({ message: 'No thought with this id!' })
    : res.json(thought)
        )
    .catch((err) => res.status(500).json(err)); 
  },
};

module.exports = thoughtController;
