"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbconnect = void 0;
const mongoose = require("mongoose");
const dbconnect = async () => {
    const uri = process.env.MONGO_URI;
    const dbConfig = {
        dbname: "DallE-Clone",
    };
    try {
        await mongoose.connect(uri, dbConfig);
        console.log("Connected to Mongoose");
    }
    catch (error) {
        console.log(error);
    }
};
exports.dbconnect = dbconnect;
