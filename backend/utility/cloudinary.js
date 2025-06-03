import { v2 as cloudinary } from 'cloudinary';
import{config} from 'dotenv';
config(); // Load environment variables from .env file

 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
 });

const uploadOnCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "chatApp",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw new Error("Cloudinary upload failed");
  }
};


export { uploadOnCloudinary };