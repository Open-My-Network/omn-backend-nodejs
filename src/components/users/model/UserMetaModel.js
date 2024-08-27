import { DataTypes, Model } from "sequelize";

import UserModel from "./UserModel.js";
import db from "../../../config/db.js";

class UserMetaModel extends Model {}

UserMetaModel.init(
  {
    umeta_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      },
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "wp_usermeta",
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default UserMetaModel;
