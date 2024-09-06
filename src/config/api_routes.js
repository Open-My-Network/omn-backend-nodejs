import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc"; 

const apiRoute = express.Router();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NodeJS API from Open My Network",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/api/",
      },
    ],
  },
  apis: ["./src/components/users/routes/user_route.js"],
};

const swaggerSpec = swaggerJSDoc(options);

apiRoute.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

apiRoute.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is UP",
  });
});

// Import routes
import authR from "../../src/components/authorization/router/AuthRoute.js";
import uRoutes from "../../src/components/users/routes/user_route.js";
import sRoutes from "../../src/components/schools/router/SchoolRouter.js";
import gradeRoute from "../../src/components/schools/router/GradeRouter.js";
import dpRoute from "../../src/components/development-plan/router/DPRouter.js";
import pRoute from "../../src/components/post/router/PostRouter.js";
import pointRoute from "../components/points/routes/PointRoutes.js";

// Use routes
apiRoute.use("/auth", authR);
apiRoute.use("/users", uRoutes);
apiRoute.use("/schools", sRoutes);
apiRoute.use("/grades", gradeRoute);
apiRoute.use("/development-plan", dpRoute);
apiRoute.use("/posts", pRoute);
apiRoute.use("/points", pointRoute);

export default apiRoute;
