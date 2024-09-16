import jwt from 'jsonwebtoken';
import { CheckPassword } from "wordpress-hash-node";
import { v4 as uuidv4 } from 'uuid';
import phpSerialize from 'php-unserialize'; // Ensure phpSerialize is installed and imported

import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from '../../users/model/UserMetaModel.js';

let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const loginUser = async (req, res) => {
  try {
    let { user_email, user_password } = req.body;

    let item = await UserModel.findOne({
      where: {
        user_email,
      },
      include: [{ model: UserMetaModel, as: "meta" }] // Ensure to include meta information
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
        message: "Password did not match",
      });
    }

    // Extract role from serialized wp_capabilities
    let roles = [];
    const capabilitiesMeta = item.meta.find(meta => meta.meta_key === 'wp_capabilities');
    if (capabilitiesMeta) {
      try {
        const deserialized = phpSerialize.unserialize(capabilitiesMeta.meta_value);
        roles = Object.keys(deserialized).filter(key => deserialized[key]);
      } catch (e) {
        roles = []; // Fallback in case of error
      }
    }

    // Extract user data without meta information
    let { user_pass, meta, ...data } = item.toJSON();
    let token = jwt.sign(
      {
        data,
        roles // Include only roles in JWT payload
      },
      JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: 200,
      accessToken: token,
      refreshToken: uuidv4(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error}`,
    });
  }
};

export default loginUser;
