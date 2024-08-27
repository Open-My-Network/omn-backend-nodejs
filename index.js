import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

// use of database
import db from "./src/config/db.js";
db.authenticate();
import UserAssociation from "./src/components/users/model/UserAssociation.js";
import SchAssociation from "./src/components/schools/model/SchAssociation.js";
import DevAssoc from "./src/components/development-plan/model/DevAssoc.js";
import PostAssociation from "./src/components/post/model/PostAssociation.js";

const PORT = process.env.PORT || 8888;

const app = express();

/**
 * use of middleware
 */
app.use(bodyParser.json());

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: ['Content-Type', 'Authorization']
// };
app.use(cors());

import apiRoute from "./src/config/api_routes.js";
app.use("/api", apiRoute);

app.listen(PORT, () => {
  console.log(`Server is loading at : ${PORT}`)
});