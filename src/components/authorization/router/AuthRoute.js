import express from "express";
import multer from "multer";

import SignUpController from "../controller/SignUpController.js";
import SignInController from "../controller/SignInController.js";
import TokenController from "../controller/TokenController.js";
import uploadController from "../controller/UploadController.js";

const authR = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit of 10 mb
});

authR.post("/register", upload.none(), SignUpController);
authR.post("/upload", upload.single("file"), uploadController);
authR.post("/login", upload.none(), SignInController);
authR.post("/verify-token", upload.none(), TokenController);

export default authR;
