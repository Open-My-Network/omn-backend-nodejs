import { DataTypes, Model } from "sequelize";
import db from "../../../config/db.js";

class PostMetaModel extends Model {}

PostMetaModel.init(
  {
    meta_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_value: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: db.sequelize,
    freezeTableName: true,
    modelName: "wp_postmeta",
    timestamps: false,
  }
);

export default PostMetaModel;
