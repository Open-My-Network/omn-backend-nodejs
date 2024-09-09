import { Op } from "sequelize";
import SchoolModel from "../model/SchoolModel.js";
import GradeModel from "../model/GradeModel.js";
import SectionModel from "../model/SectionModel.js";
import SchoolGradeModel from "../model/SchoolGradeModel.js";
import GradeSectionModel from "../model/GradeSectionModel.js";

import Joi from "joi";
import db from "../../../config/db.js";

const addSchool = async (req, res) => {
  const { sch_name, sch_code, sch_est, grades } = req.body; // Destructure grades from req.body

  try {
    // Create the school
    const school = await SchoolModel.create({
      sch_name,
      sch_code,
      sch_est,
    });

    // Add grades with sections
    for (const gradeData of grades) {
      // Create the grade
      const grade = await GradeModel.create({
        grade_name: gradeData.name,
      });

      // Associate school with grade
      await SchoolGradeModel.create({
        school_id: school.id,
        grade_id: grade.id,
      });

      // Check if sections is an array
      if (!Array.isArray(gradeData.sections)) {
        return res.status(400).json({ error: "Sections should be an array" });
      }

      // Add sections to the grade
      for (const sectionName of gradeData.sections) {
        // Create the section
        const section = await SectionModel.create({
          sec_name: sectionName,
        });

        // Associate grade with section
        await GradeSectionModel.create({
          grade_id: grade.id,
          section_id: section.id,
        });
      }
    }

    res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ error: "Failed to add school" });
  }
};

const fetchSchools = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * limit;

    let totalCount = await SchoolModel.count();

    let schools = await SchoolModel.findAll({
      limit,
      offset,
      include: [
        {
          model: GradeModel,
          as: "grades",
          through: {
            model: SchoolGradeModel,
            as: "school_grades",
          },
          include: [
            {
              model: SectionModel,
              as: "sections",
              through: {
                model: GradeSectionModel,
                as: "grade_sections",
              },
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      status: 200,
      data: schools,
      pagination: {
        totalCount,
        currentPage:page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
      }
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

const deleteSchool = async (req, res) => {
  let schId = req.query.schId;
  const transaction = await db.sequelize.transaction();
  try {
    // Check if the school exists
    const school = await SchoolModel.findByPk(schId, { transaction });
    if (!school) {
      return res.status(404).json({
        status: 404,
        message: "School not found",
      });
    }

    await SchoolGradeModel.destroy({
      where: { school_id: schId },
      transaction,
    });
    await GradeSectionModel.destroy({
      where: {
        grade_id: {
          [Op.in]: db.sequelize.literal(
            `(SELECT grade_id FROM wp_omn_school_grades WHERE school_id = ${schId})`
          ),
        },
      },
      transaction,
    });

    await school.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "School and associated records deleted successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const updateSchool = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let schId = req.query.schId;
    const { sch_name, sch_code, sch_est, grades } = req.body;

    const school = await SchoolModel.findByPk(schId, { transaction });
    if (!school) {
      return res.status(404).json({
        status: 404,
        message: "School not found",
      });
    }

    await school.update({ sch_name, sch_code, sch_est }, { transaction });

    if (grades) {
      // Delete existing grades and sections for the school
      await SchoolGradeModel.destroy({
        where: { id: schId },
        transaction,
      });
      await GradeSectionModel.destroy({
        where: {
          id: {
            [Op.in]: db.sequelize.literal(
              `(SELECT grade_id FROM wp_omn_school_grades WHERE school_id = ${schId})`
            ),
          },
        },
        transaction,
      });

      // Iterate over the grades and update them
      for (const gradeData of grades) {
        // Find or create the grade
        const [grade, created] = await GradeModel.findOrCreate({
          where: { grade_name: gradeData.name },
          defaults: { grade_name: gradeData.name },
          transaction,
        });

        // Associate school with grade
        await SchoolGradeModel.findOrCreate({
          where: { school_id: schId, grade_id: grade.id },
          defaults: { school_id: schId, grade_id: grade.id },
          transaction,
        });

        // Update or create sections for the grade
        for (const sectionName of gradeData.sections) {
          const [section, sectionCreated] = await SectionModel.findOrCreate({
            where: { sec_name: sectionName },
            defaults: { sec_name: sectionName },
            transaction,
          });

          // Associate grade with section
          await GradeSectionModel.findOrCreate({
            where: { grade_id: grade.id, section_id: section.id },
            defaults: { grade_id: grade.id, section_id: section.id },
            transaction,
          });
        }
      }
    }
    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "School updated successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

export default { fetchSchools, addSchool, deleteSchool, updateSchool };
