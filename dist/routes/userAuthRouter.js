"use strict";
const express = require("express");
const { logout, changeUsername, getMyPosts, userDetails, getMyPostsCount, usernameDetails, getRandomProfile, changeProfilePicture, } = require("../controllers/userAuthController");
const verifyToken = require("../middlewares/verifyToken");
const userAuthRoutes = express.Router();
userAuthRoutes.put("/change-username", verifyToken, changeUsername);
userAuthRoutes.post("/logout", logout);
userAuthRoutes.post("/changeProfilePicture", verifyToken, changeProfilePicture);
userAuthRoutes.get("/get-my-posts/:page", verifyToken, getMyPosts);
userAuthRoutes.get("/get-post-count", verifyToken, getMyPostsCount);
userAuthRoutes.get("/userdetails", verifyToken, userDetails); //subscription details
userAuthRoutes.get("/usernameDetails/:username", usernameDetails); //username details
userAuthRoutes.get("/randomProfile", getRandomProfile);
module.exports = userAuthRoutes;
