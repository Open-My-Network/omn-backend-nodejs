import express from "express";
import multer from "multer";

import fetchCourses from "../controller/ListCourses.js";
import uploadFileAndCreatePost from "../controller/AddCourse.js";
import deleteCourse from "../controller/DeleteCourse.js";

const coursesRoute = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

coursesRoute.get("/", fetchCourses);
coursesRoute.post("/", upload.single('file'), uploadFileAndCreatePost);
coursesRoute.delete("/", deleteCourse);

export default coursesRoute;
