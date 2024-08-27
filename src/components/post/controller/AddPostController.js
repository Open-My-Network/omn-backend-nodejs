import PostModel from "../model/PostModel.js";
import slugs from "slugs";

const addPostController = async (req, res) => {
  try {
    let {
      post_title,
      post_author,
      post_type,
      post_status,
      post_excerpt,
      post_content,
    } = req.body;
    let post_name = slugs(post_title);

    let data = await PostModel.create({
      post_title,
      post_name,
      post_author,
      post_type,
      post_status,
      post_excerpt,
      post_content,
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        message: "New Post has been added",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Internal Server error: ${error}`,
    });
  }
};

export default { addPostController };
