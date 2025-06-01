import mongoose from 'mongoose';    


const connectDB = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;
