import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class GradeSectionModel extends Model {}

GradeSectionModel.init(
  {
    grade_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "GradeModel",
        key: "id",
      },
    },
    section_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "SectionModel",
        key: "id",
      },
    },
  },
  {
    sequelize: db.sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: "wp_omn_grade_section",
    freezeTableName: true,
  }
);

export default GradeSectionModel;
