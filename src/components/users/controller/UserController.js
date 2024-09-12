import phpSerialize from 'php-serialize';

import UserModel from "../model/UserModel.js";
import UserMetaModel from "../model/UserMetaModel.js";

import db from "../../../config/db.js";

const fetchUsers = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    let sortOrder = req.query.sort === 'desc' ? 'DESC' : 'ASC';

    // Extract role from query parameters
    let role = req.query.role;
    let email = req.query.email;

    let whereCondition = {};

    if(email){
      whereCondition.user_email = email;
    }

    // Fetch users and their metadata
    let items = await UserModel.findAll({
      limit,
      offset,
      order: [['id', sortOrder]],
      where: whereCondition,
      include: [{ model: UserMetaModel, as: "meta" }],
    });

    let totalCount = await UserModel.count();

    // Function to extract and format the required data
    let extractUserData = (users) => {
      return users.map(user => {
        // Extract main user data
        let extractedUser = {
          id: user.id,
          user_login: user.user_login,
          user_email: user.user_email,
          display_name: user.display_name,
          user_registered: user.user_registered,
        };

        // Extract specific meta data
        let metaData = user.meta.reduce((acc, meta) => {
          if (['first_name', 'last_name', 'nickname', 'description', 'wp_capabilities', 'omn_user_points_stats'].includes(meta.meta_key)) {
            if (meta.meta_key === 'wp_capabilities') {
              // Deserialize wp_capabilities and return only role names
              try {
                let deserialized = phpSerialize.unserialize(meta.meta_value);
                let roleNames = Object.keys(deserialized).filter(key => deserialized[key]);
                
                // If a role is specified, filter users by this role
                if (role && roleNames.includes(role)) {
                  acc[meta.meta_key] = roleNames;
                } else if (!role) {
                  acc[meta.meta_key] = roleNames;
                }
              } catch (e) {
                acc[meta.meta_key] = []; // Fallback in case of error
              }
            } else if (meta.meta_key === 'omn_user_points_stats') {
              // Deserialize omn_user_points_stats
              try {
                const deserialized = phpSerialize.unserialize(meta.meta_value);
                acc[meta.meta_key] = deserialized;
              } catch (e) {
                acc[meta.meta_key] = meta.meta_value; // Fallback in case of error
              }
            } else {
              acc[meta.meta_key] = meta.meta_value;
            }
          }
          return acc;
        }, {});

        return { ...extractedUser, ...metaData };
      });
    };

    // Extract and format the user data
    let formattedData = extractUserData(items);

    // If a role is specified, filter the formatted data
    if (role) {
      formattedData = formattedData.filter(user => user.wp_capabilities && user.wp_capabilities.includes(role));
    }

    // Send the response
    return res.status(200).json({
      status: 200,
      items: formattedData,
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
