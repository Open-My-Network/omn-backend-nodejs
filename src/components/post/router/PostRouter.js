import express from 'express';
import multer from "multer";

import FetchController from '../controller/FetchController.js';
import AddPostController from '../controller/AddPostController.js';

const pRoute = express.Router();
const upload = multer();

pRoute.get("/", FetchController.fetchPost);
pRoute.post('/', upload.none(), AddPostController.addPostController);

export default pRoute;