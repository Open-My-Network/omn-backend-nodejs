import { DataTypes, DATE, Model } from "sequelize";

import db from "../../../config/db.js";

class PostModel extends Model {}

PostModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    guid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_author: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    post_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_excerpt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    to_ping: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    pinged: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    post_content_filtered:{
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    post_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date(),
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "wp_posts",
    freezeTableName: true,
    timestamps: false,
  }
);

export default PostModel;
