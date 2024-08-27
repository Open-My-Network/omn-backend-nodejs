import DevelopmentPlanMeta from "../model/DevelopmentPlanMeta.js";
import DevelopmentPlanVerify from "../model/DevelopmentPlanVerify.js";
import DevelopmentPlanModel from "../model/DevelopmentPlanModel.js";

const fetchRequest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status || null;

  try {
    // let whereCondition = {};

    // if (status) {
    //   whereCondition.meta.meta_key = "status";
    //   whereCondition.meta.meta_value = status;
    // }

    let plans = await DevelopmentPlanVerify.findAndCountAll({
      // where: whereCondition,
      include: [
        {
          model: DevelopmentPlanModel,
          as: "plan",
        },
        {
          model: DevelopmentPlanMeta,
          as: "meta",
        },
      ],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(plans.count / limit);

    res.status(200).json({
      data: plans.rows,
      currentPage: page,
      totalPages: totalPages,
      totalItems: plans.count,
      itemsPerPage: limit,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const updateRequest = async (req, res) => {};

export default { fetchRequest, updateRequest };
