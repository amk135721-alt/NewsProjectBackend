
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "c39rbbrm",
  api_key: "357186157865293",
  api_secret: "_rsdU5cXbqOzDTXNynrKys69Gsc",
})


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "NEWS"
  }
})


export const upload = multer({ storage })

