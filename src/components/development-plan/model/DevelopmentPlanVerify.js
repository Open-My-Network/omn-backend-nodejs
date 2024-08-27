import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class DevelopmentPlanVerify extends Model {}

DevelopmentPlanVerify.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "wp_dp_verify_req",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default DevelopmentPlanVerify;
