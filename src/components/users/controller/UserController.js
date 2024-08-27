import UserModel from "../model/UserModel.js";
import UserMetaModel from "../model/UserMetaModel.js";

import db from "../../../config/db.js";

const fetchUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sortOrder = req.query.sort === 'desc' ? 'DESC' : 'ASC';

    // Fetch users and their metadata
    let items = await UserModel.findAll({
      limit,
      offset,
      order: [['id', sortOrder]],
      include: [{ model: UserMetaModel, as: "meta" }],
    });

    const totalCount = await UserModel.count();

    // Function to extract and format the required data
    const extractUserData = (users) => {
      return users.map(user => {
        // Extract main user data
        const extractedUser = {
          id: user.id,
          user_login: user.user_login,
          user_email: user.user_email,
          display_name: user.display_name,
          user_registered: user.user_registered,
        };

        // Extract specific meta data
        const metaData = user.meta.reduce((acc, meta) => {
          if (['first_name', 'last_name', 'nickname', 'description', 'wp_capabilities'].includes(meta.meta_key)) {
            acc[meta.meta_key] = meta.meta_value;
          }
          return acc;
        }, {});

        return { ...extractedUser, ...metaData };
      });
    };

    // Extract and format the user data
    const formattedData = extractUserData(items);

    // Send the response
    return res.status(200).json({
      status: 200,
      data: formattedData,
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
      message: `Server Error: ${error}`,
    });
  }
};


const deleteUser = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    let userId = req.query.userId;

    await UserModel.sequelize.query(
      "DELETE FROM wp_shout_out WHERE user_id = :userId",
      { replacements: { userId }, type: UserModel.sequelize.QueryTypes.DELETE }
    );

    // Delete the user
    let val = await UserModel.destroy({
      where: {
        id: userId,
      },
    });

    await t.commit();
    res.status(200).json({
      status: 200,
      message: val === 1 ? "User removed successfully" : "User does not exists",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      status: 500,
      message: `Server Error : ${error}`,
    });
  }
};

const passwordReset = async (req, res) => {
  let { newPassword, confirmPassword } = req.body;
};

export default { fetchUsers, deleteUser, passwordReset };
