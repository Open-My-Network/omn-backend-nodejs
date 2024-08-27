import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class SchoolGradeModel extends Model {}

SchoolGradeModel.init(
  {
    school_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "SchoolModel",
        key: "id",
      },
    },
    grade_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "GradeModel",
        key: "id",
      },
    },
  },
  {
    sequelize: db.sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: "wp_omn_school_grades",
    freezeTableName: true,
  }
);

export default SchoolGradeModel;
