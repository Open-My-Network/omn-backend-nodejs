import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import CourseModel from "../model/CourseModel.js";
import s3Client from "../../../config/s3_config.js";

const extractFileKeyFromUrl = (url) => {
  const parts = url.split("/");
  return parts.slice(3).join("/"); 
};

const deleteCourse = async (req, res) => {
  const { id } = req.query; 
  try {
    // Fetch the post from the database
    const post = await CourseModel.findByPk(id); 

    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }

    // Extract the S3 file key from the post's video URL
    const fileKey = extractFileKeyFromUrl(post.videoUrl);

    // Parameters for deleting the file from S3
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    };

    // Delete the file from S3
    await s3Client.send(new DeleteObjectCommand(params));

    // Delete the post from the database
    await post.destroy(); // Sequelize's way to delete a record

    return res.status(200).json({
      status: 200,
      message: "Post and file deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting post or file: ${error.message}`, error);
    return res.status(500).json({
      status: 500,
      error: `Error occurred: ${error.message}`,
    });
  }
};

export default deleteCourse;
