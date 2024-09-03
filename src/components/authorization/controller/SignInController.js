import jwt from 'jsonwebtoken';
import { CheckPassword } from "wordpress-hash-node";
import {v4 as uuidv4} from 'uuid';

import UserModel from "../../users/model/UserModel.js";

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

  export default loginUser