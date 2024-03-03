"use strict";
const mongoose = require("mongoose");
const promptSchema = mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    },
    negPrompt: {
        type: String
    }
});
const Prompt = mongoose.model("Prompt", promptSchema);
module.exports = Prompt;
