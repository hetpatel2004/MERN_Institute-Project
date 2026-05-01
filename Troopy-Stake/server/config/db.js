const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<db_username>:het1234567@cluster0.iocci0v.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;