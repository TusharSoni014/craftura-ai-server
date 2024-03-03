"use strict";
const express = require("express");
const { contactUs } = require("../controllers/contactController");
const contactRouter = express.Router();
contactRouter.post("/contact", contactUs);
module.exports = contactRouter;
