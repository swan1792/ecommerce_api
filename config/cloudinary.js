import { v2 as cloudinary, v2 } from 'cloudinary';

const connectCloudinary = async() => {
    v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
  });
  console.log("Cloudinary is connected");
}

export default connectCloudinary;