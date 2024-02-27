const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: validator.isEmail,
    },
    googleId: {
      type: String,
    },
    picture: {
      type: String,
    },
    fav_posts: [
      {
        image_id: mongoose.Schema.Types.ObjectId,
        url: String,
      },
    ],
    posts: [
      {
        type: String,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
