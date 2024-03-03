const mongoose = require("mongoose");

export const dbconnect = async () => {
  const uri = process.env.MONGO_URI;
  const dbConfig = {
    dbname: "DallE-Clone",
  };
  try {
    await mongoose.connect(uri, dbConfig);
    console.log("Connected to Mongoose");
  } catch (error) {
    console.log(error);
  }
};
