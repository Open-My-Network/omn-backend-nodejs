import { Sequelize } from "sequelize";

let DATABASE_NAME = process.env.DATABASE_NAME;
let DATABASE_HOST = process.env.DATABASE_HOST;
let DATABASE_USER = process.env.DATABASE_USER;
let DATABASE_PASS = process.env.DATABASE_PASS;
let DATABASE_PORT = process.env.DATABASE_PORT;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
  host: DATABASE_HOST,
  dialect: 'mysql',
  port: DATABASE_PORT
});

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default { sequelize, authenticate };
