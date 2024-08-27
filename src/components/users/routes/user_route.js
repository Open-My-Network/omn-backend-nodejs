import express from "express";
import UserController from "../controller/UserController.js";

const uRoutes = express.Router();

uRoutes.get("", UserController.fetchUsers);
uRoutes.delete("", UserController.deleteUser)

export default uRoutes;
