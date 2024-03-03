"use strict";
const express = require("express");
const { generateImages, getAllImages, getUserImages, } = require("../controllers/imageGeneratorController");
const verifyToken = require("../middlewares/verifyToken");
const { postDetails } = require("../controllers/postDetailsController");
const imageGeneratorRouter = express.Router();
imageGeneratorRouter.get("/getAllImages/:page", getAllImages);
imageGeneratorRouter.get("/getUserImage/:username/:page", getUserImages);
imageGeneratorRouter.post("/postDetails", postDetails);
imageGeneratorRouter.post("/generate", verifyToken, generateImages);
module.exports = imageGeneratorRouter;
