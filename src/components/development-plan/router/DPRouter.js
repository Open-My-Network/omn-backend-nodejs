import express from "express";

import DPController from "../controller/DevelopmentPlanController.js";
import DPReqController from "../controller/DevReqVerification.js";
import AuthMiddleware from "../../authorization/middleware/AuthMiddleware.js";

const dpRoute = express.Router();

dpRoute.get("/", AuthMiddleware, DPController.fetchItems);
dpRoute.get('/verification-request', DPReqController.fetchRequest);

dpRoute.delete("/", DPController.deleteItem);

export default dpRoute;
