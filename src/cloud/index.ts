import { CLOUD_KEY, CLOUD_NAME, CLOUD_SECRET } from "#/utiles/variables";
import { v2 as cloudinary } from "cloudinary";
 
cloudinary.config({
  api_key: CLOUD_KEY,
  cloud_name: CLOUD_NAME,
  api_secret: CLOUD_SECRET,
});

export default cloudinary

