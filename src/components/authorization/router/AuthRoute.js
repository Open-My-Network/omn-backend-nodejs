import express from 'express';
import multer from 'multer';

import AuthController from '../controller/AuthController.js';

const authR = express.Router();
const upload = multer();

authR.post("/register", upload.none(), AuthController.registerUser);
authR.post("/login", upload.none(), AuthController.loginUser);
authR.post("/verify-token", upload.none(), AuthController.verifyToken);

export default authR;