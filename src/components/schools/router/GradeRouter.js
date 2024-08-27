import express from "express";

import GradeController from "../controller/GradeController.js";

const gradeRoute = express.Router();

gradeRoute.get("/", GradeController.fetchGrade);
gradeRoute.post("/", GradeController.createGrade);
gradeRoute.delete("/", GradeController.deleteGrade);
gradeRoute.put("/", GradeController.updateGrade);

export default gradeRoute;
