const { User, Thought } = require("../models");

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
  },

  // get a user 
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .select("-__v")
      .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with this id!' })
        : res.json(user)
      )
      .catch((err) => res.status(500).json(err)); 
  },

  // create user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then((user) =>
    !user
      ? res.status(404).json({ message: 'No user with this id!' })
      : res.json(user)
    )
    .catch((err) => res.status(500).json(err)); 
  },

  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => 
      !user
      ? res.status(404).json({ message: 'No user with that ID' })
      : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId} },
      { new: true , runValidators: true}
    )
      .then((user) => 
      !user
      ? res.status(404).json({ message: 'No user with this id!' })
      : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // delete friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then((user) => 
    !user
    ? res.status(404).json({ message: 'No user with this id!' })
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
