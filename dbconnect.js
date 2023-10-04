const mongoose = require("mongoose");

const dbconnect = async () => {
  const uri = process.env.MONGO_URI;
  const dbConfig = {
    dbname: "DallE-Clone",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(uri, dbConfig);
    console.log("Connected to Mongoose");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbconnect;
