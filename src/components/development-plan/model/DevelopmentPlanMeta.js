import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class DevelopmentPlanMeta extends Model {}

DevelopmentPlanMeta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    goal_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goal_time_line: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goal_desciption: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize: db.sequelize,
    modelName: "wp_student_development_plan_meta",
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

export default DevelopmentPlanMeta;
