import express from "express";
import UserController from "../controller/UserController.js";

const uRoutes = express.Router();

/**
 * @swagger
 *  /users:
 *    get:
 *      summary: Fetch all users
 *      description: Retrieve a list of all users.
 *      responses:
 *        200:
 *          description: A list of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    email:
 *                      type: string
 *    delete:
 *      summary: Delete all users
 *      description: Delete all users from the database.
 *      responses:
 *        200:
 *          description: Users deleted successfully
 */
uRoutes.get("/", UserController.fetchUsers);
uRoutes.delete("/", UserController.deleteUser);

export default uRoutes;
