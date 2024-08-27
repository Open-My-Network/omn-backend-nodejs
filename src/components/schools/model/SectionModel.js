import {DataTypes, Model} from "sequelize";

import db from "../../../config/db.js";

class SectionModel extends Model{}

SectionModel.init({
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	sec_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	sequelize: db.sequelize,
	timestamps: false,
	createdAt: false,
	updatedAt: false,
	modelName: "wp_omn_sections",
	freezeTableName: true,
});

export default SectionModel;