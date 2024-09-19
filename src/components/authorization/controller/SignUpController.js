import { HashPassword } from "wordpress-hash-node";
import phpSerialize from "php-serialize";

import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import db from "../../../config/db.js";

const registerUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let { user_email, user_pass, user_nicename, meta } = req.body;

    user_pass = HashPassword(user_pass);

    // Create user
    let user = await UserModel.create(
      {
        user_login: user_nicename,
        user_email,
        user_pass,
        display_name: user_nicename,
        user_nicename,
        user_activation_key: "asdad",
        user_status: 0,
      },
      { transaction }
    );

    // Prepare meta data
    let metaData = meta.map((m) => {
      let metaValue = m.meta_value;
      
      // Serialize wp_capabilities
      if (m.meta_key === "wp_capabilities") {
        metaValue = phpSerialize.serialize({ subscriber: true }); // Serialize capabilities
      }

      // Serialize grades
      if (m.meta_key === "grades") {
        // Assuming grades is an array or object, serialize accordingly
        metaValue = phpSerialize.serialize(metaValue);
      }
      
      return {
        user_id: user.id,
        meta_key: m.meta_key,
        meta_value: metaValue,
      };
    });

    // Ensure default capabilities if not provided
    const wpCapabilitiesMeta = meta.find((m) => m.meta_key === "wp_capabilities");
    if (!wpCapabilitiesMeta) {
      metaData.push({
        user_id: user.id,
        meta_key: "wp_capabilities",
        meta_value: phpSerialize.serialize({ subscriber: true }), 
      });
    }

    // Ensure default grades if not provided
    const gradesMeta = meta.find((m) => m.meta_key === "grades");
    if (!gradesMeta) {
      metaData.push({
        user_id: user.id,
        meta_key: "grades",
        meta_value: phpSerialize.serialize([]), // Default to an empty array or object
      });
    }

    // Bulk insert the meta data
    const userMeta = await UserMetaModel.bulkCreate(metaData, { transaction });

    await transaction.commit();

    // Format response data
    const formattedUserMeta = userMeta.map((m, index) => ({
      umeta_id: m.umeta_id,
      user_id: m.user_id,
      meta_key: metaData[index].meta_key, // Include meta_key
      meta_value: metaData[index].meta_value // Include meta_value
    }));

    return res.status(201).json({
      status: 201,
      data: { user, userMeta: formattedUserMeta },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error}`,
    });
  }
};

export default registerUser;
