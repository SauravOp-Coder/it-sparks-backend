import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const courseStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isBrochure = file.fieldname === "brochure";

    return {
      folder: isBrochure
        ? "it-sparks-technologies/course-brochures"
        : "it-sparks-technologies/course-images",
      resource_type: isBrochure ? "raw" : "image",
      allowed_formats: isBrochure
        ? ["pdf"]
        : ["jpg", "jpeg", "png", "webp"],
      use_filename: true,
      unique_filename: true,
    };
  },
});

const courseUpload = multer({
  storage: courseStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default courseUpload;