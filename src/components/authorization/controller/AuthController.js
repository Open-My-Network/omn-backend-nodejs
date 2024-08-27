import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import db from "../../../config/db.js";

const registerUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let { user_email, user_pass, user_nicename, meta } = req.body;
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

    const metaData = meta.map((m) => ({
      user_id: user.id,
      meta_key: m.meta_key,
      meta_value: m.meta_value,
    }));

    const userMeta = await UserMetaModel.bulkCreate(metaData, {
      transaction,
    });
    await transaction.commit();
    return res.status(201).json({
      status: 201,
      data: { user, userMeta },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { user_email, user_password } = req.body;

    let userCheck = await UserModel.findOne({
      where: {
        user_email,
      },
    });
    if (!userCheck) {
      return res.status(400).json({
        status: 400,
        message: "Item not found",
      });
    }

    if (userCheck["user_pass"] !== user_password) {
      return res.status(400).json({
        status: 400,
        message: "Password did not matched",
      });
    }

    return res.status(200).json({
      status: 200,
      pass: userCheck,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

export default { registerUser, loginUser };
