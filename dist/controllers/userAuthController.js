"use strict";
const User = require("../models/User");
const Post = require("../models/Post");
const { default: axios } = require("axios");
const allowedCharactersRegex = /^[a-zA-Z0-9-_]+$/;
const logout = async (req, res) => {
    req.session = null;
    return res.status(200).send({ message: "Logged out successfully." });
};
const getMyPosts = async (req, res) => {
    const userId = req._id;
    const page = parseInt(req.params.page);
    const pageSize = 8;
    try {
        const myPosts = await Post.find({ owner: userId })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select("negPrompt prompt seed url _id")
            .sort({ createdAt: -1 });
        const postsWithBase64Images = await Promise.all(myPosts.map(async (post) => {
            const imageUrl = post.url;
            try {
                const response = await axios.get(imageUrl, {
                    responseType: "arraybuffer",
                });
                if (response.status === 200) {
                    const base64Image = Buffer.from(response.data, "binary").toString("base64");
                    post.url = `data:image/png;base64,${base64Image}`;
                }
            }
            catch (error) {
                console.error("Error fetching image:", error.message);
            }
            return post;
        }));
        return res.status(200).send({ posts: postsWithBase64Images });
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Some error occurred while getting posts" });
    }
};
const getMyPostsCount = async (req, res) => {
    const userId = req._id;
    try {
        const totalPostsCount = await Post.countDocuments({ owner: userId });
        return res.status(200).send({ postsCount: totalPostsCount });
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Some error occurred while getting posts count" });
    }
};
const changeUsername = async (req, res) => {
    const userId = req._id;
    const { newUsername } = req.body;
    if (!newUsername) {
        return res.status(401).send({ message: "please provide new username" });
    }
    if (!allowedCharactersRegex.test(newUsername)) {
        return res.status(400).send({ message: "Invalid characters in username." });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const existingUsername = await User.findOne({ username: newUsername });
        if (existingUsername) {
            return res.status(400).send({
                message: "This username already exists, try another",
                existingUsername: existingUsername,
            });
        }
        if (newUsername.length < 3 || newUsername.length > 30) {
            return res.status(400).send({ message: "Username length invalid !" });
        }
        user.username = newUsername;
        const updatedUser = await user.save();
        return res.status(200).send({
            message: "Username changed successfully",
            newUsername: updatedUser.username,
        });
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Cannot change username due to some unknown error" });
    }
};
const userDetails = async (req, res) => {
    const userId = req._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({
            username: user.username,
            picture: user.picture,
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error getting user" });
    }
};
const usernameDetails = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({
            username: user.username,
            picture: user.picture,
            postsLength: user.posts.length,
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Error fetching user!" });
    }
};
const getRandomProfile = async (req, res) => {
    try {
        const min = 1;
        const max = 999999999;
        const randomSeed = Math.floor(Math.random() * (max - min + 1)) + min;
        return res.status(200).send({
            result: `https://api.dicebear.com/7.x/open-peeps/svg?seed=${randomSeed}`,
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Couldn't create avatar!" });
    }
};
const changeProfilePicture = async (req, res) => {
    const userId = req._id;
    const { pictureUrl } = req.body;
    try {
        const user = await User.findById(userId);
        if (!pictureUrl) {
            return res.status(404).send({ message: "Picture url not found" });
        }
        user.picture = pictureUrl;
        await user.save();
        return res
            .status(200)
            .send({ message: "Profile picture changed successfully!" });
    }
    catch (error) {
        return res.status(500).send({ message: "Error changing profile pic!" });
    }
};
module.exports = {
    logout,
    getMyPosts,
    changeUsername,
    userDetails,
    getMyPostsCount,
    usernameDetails,
    getRandomProfile,
    changeProfilePicture,
};
