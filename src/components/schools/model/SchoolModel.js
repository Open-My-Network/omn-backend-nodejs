import { DataTypes, Model } from "sequelize";

import db from "../../../config/db.js";

let DATABASE_PREFIX = process.env.DATABASE_PREFIX;

class SchoolModel extends Model {}

SchoolModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sch_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sch_est: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    modelName: `${DATABASE_PREFIX}_omn_schools`,
    freezeTableName: true,
  }
);

export default SchoolModel;
