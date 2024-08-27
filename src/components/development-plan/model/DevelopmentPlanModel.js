import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class DevelopmentPlanModel extends Model {}

DevelopmentPlanModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sdp_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    est_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    srt_month: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_month: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "student_development_plan",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default DevelopmentPlanModel;
