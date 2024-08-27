import PostModel from "../model/PostModel.js";
import PostMetaModel from "../model/PostMetaModel.js";

const fetchPost = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    let postType = req.query.post_type;
    let postStatus = req.query.post_status;
    let sortOrder = req.query.sort_order || 'DESC';

    let whereClause = {};
    if (postType) {
      whereClause.post_type = postType;
    }

    if (postStatus) {
      whereClause.post_status = postStatus;
    }

    let data = await PostModel.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['id', sortOrder]],
      include: [{ model: PostMetaModel, as: "meta" }],
    });

    let totalCount = await PostModel.count({
      where: whereClause,
    });

    return res.status(200).json({
      status: 200,
      data,
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
      error: `Internal Server error: ${error}`,
    });
  }
};

export default { fetchPost };
