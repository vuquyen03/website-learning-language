import mongoose from "mongoose";

// setup connection to mongodb
const connectDB = async (url) => {
  try {
    const conn = await mongoose.connect(url, {
      dbName: 'learning-app',
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;