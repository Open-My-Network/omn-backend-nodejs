import GradeModel from "../model/GradeModel.js";
import slugs from "slugs";

const createGrade = async (req, res) => {
  try {
    let { grade_title } = req.body;
    let grade_slug = slugs(grade_title);

    let items = await GradeModel.create({
      grade_title,
      grade_slug,
    });

    return res.status(201).json({
      status: 201,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const fetchGrade = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let items = await GradeModel.findAll({
      limit,
      offset,
    });

    const totalCount = await GradeModel.count();

    return res.status(200).json({
      status: 200,
      data: items,
      pagination: {
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const deleteGrade = async (req, res) => {
  try {
    let { gradeId } = req.query;

    let response = await GradeModel.destroy({
      where: {
        id: gradeId,
      },
    });

    if (response === 0) {
      return res.status(400).json({
        status: 400,
        message: "Grade not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const updateGrade = async (req, res) => {
  try {
    let { gradeId } = req.query;
    let { grade_title } = req.body;
    let grade_slug = slugs(grade_title);

    let items = await GradeModel.update(
      {
        grade_title,
        grade_slug,
      },
      {
        where: {
          id: gradeId,
        },
      }
    );

    return res.status(200).json({
      status: 200,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

export default { createGrade, fetchGrade, deleteGrade, updateGrade };
