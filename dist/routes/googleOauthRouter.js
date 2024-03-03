"use strict";
const express = require("express");
const passport = require("passport");
const googleOauthRouter = express.Router();
const getGoogleUser = require("../controllers/googleAuthController");
const verifyToken = require("../middlewares/verifyToken");
const successLoginUrl = `${process.env.FE_URL}/signon-success`;
const errorLoginUrl = `${process.env.FE_URL}/signup`;
googleOauthRouter.get("/login", passport.authenticate("google", { scope: ["profile", "email"] }));
googleOauthRouter.get("/callback", passport.authenticate("google", {
    failureMessage: "Google SSO Failed",
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
}));
googleOauthRouter.get("/user", verifyToken, getGoogleUser);
module.exports = googleOauthRouter;
