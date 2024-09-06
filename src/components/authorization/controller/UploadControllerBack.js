import csvParser from "csv-parser";
import stream from "stream";
import { HashPassword } from "wordpress-hash-node";
import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import db from "../../../config/db.js";

const uploadController = async (req, res) => {
  let transaction;

  try {
    transaction = await db.sequelize.transaction();
    let fileBuffer = req.file.buffer;
    let results = [];

    let readable = new stream.Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);

    readable
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (let row of results) {
            let { first_name, last_name, email, password, user_nicename } = row;
            password = HashPassword(password);

            let [user, created] = await UserModel.findOrCreate({
              where: { user_email: email },
              defaults: {
                user_login: user_nicename,
                user_pass: password,
                display_name: user_nicename,
                user_nicename,
                user_activation_key: "asdad",
                user_status: 0,
              },
              transaction,
            });

            if (created) {
              const metaData = [
                {
                  user_id: user.id,
                  meta_key: "first_name",
                  meta_value: first_name,
                },
                {
                  user_id: user.id,
                  meta_key: "last_name",
                  meta_value: last_name,
                },
              ].filter((meta) => meta.meta_key && meta.meta_value);

              await UserMetaModel.bulkCreate(metaData, { transaction });
            } else {
              return res.status(400).json({
                status: 500,
                message: `User with email ${email} already exists.`,
              });
            }
          }

          await transaction.commit();
          return res.status(201).json({
            status: 201,
            message: "Users registered successfully from CSV!",
          });
        } catch (err) {
          await transaction.rollback();

          return res.status(500).json({
            status: 500,
            message: `Error processing CSV data: ${err}`,
          });
        }
      });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      status: 500,
      message: `Internal Server error: ${error}`,
    });
  }
};

export default uploadController;
