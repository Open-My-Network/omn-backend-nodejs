import express from "express";
import multer from "multer";

import DPController from "../controller/DevelopmentPlanController.js";
import DPReqController from "../controller/DevReqVerification.js";
import DevelopmentPoints from "../controller/DevelopmentPoints.js";
import AuthMiddleware from "../../authorization/middleware/AuthMiddleware.js";

const dpRoute = express.Router();
const upload = multer();
// AuthMiddleware,
dpRoute.get("/",  DPController.fetchItems);

dpRoute.get('/verification-request', DPReqController.fetchRequest);
dpRoute.put("/verification-request", upload.none(), DPReqController.updateRequest);
dpRoute.post("/grant-point", DevelopmentPoints.grantPoint);

dpRoute.delete("/", DPController.deleteItem);

export default dpRoute;
