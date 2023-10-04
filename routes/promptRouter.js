const express = require("express");
const {
  getRandomPrompt,
} = require("../controllers/promptController");
const promptRouter = express.Router();

promptRouter.get("/random", getRandomPrompt);

module.exports = promptRouter;
