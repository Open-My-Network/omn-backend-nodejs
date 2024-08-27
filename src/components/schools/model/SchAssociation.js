import SchoolModel from "./SchoolModel.js";
import GradeModel from "./GradeModel.js";
import SectionModel from "./SectionModel.js";
import SchoolGradeModel from "./SchoolGradeModel.js";
import GradeSectionModel from "./GradeSectionModel.js";

// School and Grades
SchoolModel.belongsToMany(GradeModel, {
  through: SchoolGradeModel,
  foreignKey: "school_id",
  as: 'grades',
});
GradeModel.belongsToMany(SchoolModel, {
  through: SchoolGradeModel,
  foreignKey: "grade_id",
  as: "schools",
});

// Grades and Sections
GradeModel.belongsToMany(SectionModel, {
  through: GradeSectionModel,
  foreignKey: "grade_id",
  as: "sections"
});
SectionModel.belongsToMany(GradeModel, {
  through: GradeSectionModel,
  foreignKey: "section_id",
  as: "grades"
});

export default {
  SchoolModel,
  GradeModel,
  SectionModel,
  SchoolGradeModel,
  GradeSectionModel,
};
