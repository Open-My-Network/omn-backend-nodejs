import express from 'express';

import PointsController from '../controller/PointsController.js';

const pointRoute = express.Router();

pointRoute.get('/', PointsController.pointList);

export default pointRoute;