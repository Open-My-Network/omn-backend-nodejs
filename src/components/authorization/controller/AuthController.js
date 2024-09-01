import { HashPassword, CheckPassword } from "wordpress-hash-node";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import db from "../../../config/db.js";

const registerUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    let { user_email, user_pass, user_nicename, meta } = req.body;
    user_pass = HashPassword(user_pass);
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

    let item = await UserModel.findOne({
      where: {
        user_email,
      },
    });
    if (!item) {
      return res.status(400).json({
        status: 400,
        message: "User not found",
      });
    }

    let checked = CheckPassword(user_password, item["user_pass"]);

    if (!checked) {
      return res.status(400).json({
        status: 400,
        message: "Password did not matched",
      });
    }

    let { user_pass, ...data } = item.toJSON();
    let token = jwt.sign(
      {
        data,
      },
      "secret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      status: 200,
      accessToekn: token,
      refreshToken: uuidv4(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

let verifyToken = async (req, res) => {
  try {
    let { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: 400,
        message: "Refresh token is required",
      });
    }
    jwt.verify(refreshToken, "secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "Invalid refresh token",
        });
      }

      // Generate a new access token
      const { id, email, user_nicename } = decoded;
      const newAccessToken = jwt.sign(
        { id, email, user_nicename },
        "secret",
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        status: 200,
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error : ${error}`,
    });
  }
};

export default { registerUser, loginUser, verifyToken };
