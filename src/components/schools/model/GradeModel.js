import {DataTypes, Model} from "sequelize";

import db from "../../../config/db.js";

class GradeModel extends Model{}

GradeModel.init({
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	grade_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	sequelize: db.sequelize,
	timestamps: false,
	createdAt: false,
	updatedAt: false,
	modelName: "wp_omn_grades",
	freezeTableName: true,
});

export default GradeModel;