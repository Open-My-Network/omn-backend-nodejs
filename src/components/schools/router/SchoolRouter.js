import express from "express";

import SchoolController from "../controller/SchoolController.js";

const sRoute = express.Router();

sRoute.get("/", SchoolController.fetchSchools);
sRoute.post("/", SchoolController.addSchool);
sRoute.delete("/", SchoolController.deleteSchool);
sRoute.put("/", SchoolController.updateSchool);

export default sRoute;