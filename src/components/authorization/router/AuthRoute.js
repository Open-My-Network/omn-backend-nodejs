import express from 'express';
import multer from 'multer';

import SignUpController from '../controller/SignUpController.js';
import SignInController from "../controller/SignInController.js";
import TokenController from "../controller/TokenController.js";

const authR = express.Router();
const upload = multer();

authR.post("/register", upload.none(), SignUpController);
authR.post("/login", upload.none(), SignInController);
authR.post("/verify-token", upload.none(), TokenController);

export default authR;