import express from "express";

const apiRoute = express.Router();

apiRoute.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is UP",
  });
});

import authR from "../../src/components/authorization/router/AuthRoute.js";
apiRoute.use("/auth", authR);

import uRoutes from "../../src/components/users/routes/user_route.js";
apiRoute.use("/users", uRoutes);

import sRoutes from "../../src/components/schools/router/SchoolRouter.js";
apiRoute.use("/schools", sRoutes);

import gradeRoute from "../../src/components/schools/router/GradeRouter.js";
apiRoute.use("/grades", gradeRoute);

import dpRoute from "../../src/components/development-plan/router/DPRouter.js";
apiRoute.use("/development-plan", dpRoute);

import pRoute from "../../src/components/post/router/PostRouter.js";
apiRoute.use("/posts", pRoute);

import pointRoute from "../components/points/routes/PointRoutes.js";
apiRoute.use("/points", pointRoute);

export default apiRoute;