import multer  from "multer";
import { storage } from "../utils/cloudinary.js";

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
    return cb(new Error("Only image files (jpeg, jpg, png) are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

export default upload;