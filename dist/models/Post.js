"use strict";
const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    seed: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    negPrompt: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
