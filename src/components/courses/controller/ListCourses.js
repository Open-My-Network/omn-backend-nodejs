import CourseModel from "../model/CourseModel.js";
import generatePresignedUrl from "../helper/generateUrl.js"; 

// Controller to fetch all posts
const fetchCourses = async (req, res) => {
  try {
    // Fetch all posts from the database
    const items = await CourseModel.findAll();

    // Loop through each item and generate a presigned URL for the video
    const itemsWithPresignedUrl = await Promise.all(
      items.map(async (item) => {
        if (item.s3_key) {
          // Generate presigned URL using the s3_key
          const presignedVideoUrl = await generatePresignedUrl(process.env.BUCKET_NAME, item.s3_key);
          
          return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            chapter: item.chapter,
            grade: item.grade,
            school_name: item.school_name,
            s3_key: item.s3_key,
            videoUrl: presignedVideoUrl, // Presigned URL
            content: item.content,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
          };
        } else {
          return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            chapter: item.chapter,
            grade: item.grade,
            school_name: item.school_name,
            s3_key: item.s3_key,
            videoUrl: null, // or whatever fallback you prefer
            content: item.content,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
          };
        }
      })
    );

    // Respond with the items containing the formatted response
    return res.status(200).json({
      status: 200,
      message: "Courses fetched successfully", // Add a message if needed
      items: itemsWithPresignedUrl,
    });
  } catch (error) {
    console.error(`Error fetching courses: ${error.message}`, error);
    return res.status(500).json({
      status: 500,
      error: `Error occurred: ${error.message}`,
    });
  }
};

export default fetchCourses;
