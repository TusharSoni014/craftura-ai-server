"use strict";
const Post = require("../models/Post");
const User = require("../models/User");
const moment = require("moment");
const postDetails = async (req, res) => {
    const { postId } = req.body;
    try {
        const post = await Post.findById(postId);
        const owner = await User.findById(post.owner);
        return res.status(200).send({
            owner: owner === null ? undefined : owner.username,
            prompt: post.prompt,
            negPrompt: post.negPrompt,
            seed: post.seed,
            createdAt: moment(post.createdAt).format("D MMM YYYY")
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error: Post not found!" });
    }
};
module.exports = { postDetails };
