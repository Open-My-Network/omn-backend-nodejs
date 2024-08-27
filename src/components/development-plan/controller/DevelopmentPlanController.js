import DevelopmentPlanModel from "../model/DevelopmentPlanModel.js";

const fetchItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let items = await DevelopmentPlanModel.findAll({
      limit,
      offset,
    });

    const totalCount = await DevelopmentPlanModel.count();

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

const deleteItem = async (req, res) => {};

export default { fetchItems, deleteItem };
