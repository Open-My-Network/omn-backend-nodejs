import DevelopmentPlanMeta from "../model/DevelopmentPlanMeta.js";
import DevelopmentPlanVerify from "../model/DevelopmentPlanVerify.js";
import DevelopmentPlanModel from "../model/DevelopmentPlanModel.js";

const fetchRequest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {

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

const updateRequest = async (req, res) => {
  let { id, status } = req.body;
  try {
    let plan = await DevelopmentPlanVerify.findOne({
      where: { milestone_id: id, meta_key: "status" },
    });
    if (!plan) {
      return res.status(404).json({
        status: 404,
        message: "Plan not found",
      });
    }

    plan.meta_value = status;
    await plan.save();

    res.status(200).json({
      status: 200,
      message: "Status updated successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

export default { fetchRequest, updateRequest };
