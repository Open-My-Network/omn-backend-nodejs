import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_nicename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_registered: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date,
    },
    user_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "wp_users",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default UserModel;
