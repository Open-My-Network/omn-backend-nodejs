import ExcelJS from "exceljs";
import { HashPassword } from "wordpress-hash-node";
import phpSerialize from "php-serialize";
import UserModel from "../../users/model/UserModel.js";
import UserMetaModel from "../../users/model/UserMetaModel.js";
import db from "../../../config/db.js";

const uploadController = async (req, res) => {
  let transaction;

  try {
    // Begin transaction
    transaction = await db.sequelize.transaction();

    const file = req.file.buffer;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    let data = [];
    
    // Process each sheet (worksheet)
    workbook.eachSheet((worksheet) => {
      // Split worksheet name into grade and section
      const [grade, gradeNumber, sectionLabel, sectionName] = worksheet.name.split('-');
      const gradeInfo = `${grade} ${gradeNumber}`;  // Example: "Grade 6"
      const sectionInfo = `${sectionLabel} ${sectionName}`; // Example: "Section A"

      let headers = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          row.eachCell((cell) => {
            headers.push(cell.value);
          });
        } else {
          let rowData = {};
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.value;
          });
          // Add grade and section info to row data
          rowData.grade = gradeInfo;
          rowData.section = sectionInfo;
          data.push(rowData);
        }
      });
    });

    // Process each row (each user)
    for (const row of data) {
      let { first_name, last_name, email, password, user_nicename, grade, section } = row;

      // Hash the password
      password = HashPassword(password);

      // Create the user
      const user = await UserModel.create(
        {
          user_login: user_nicename,
          user_email: email,
          user_pass: password,
          display_name: `${first_name} ${last_name}`,
          user_nicename,
          user_activation_key: "some_random_key", // or generate dynamically
          user_status: 0,
        },
        { transaction }
      );

      // Prepare the meta data
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
        {
          user_id: user.id,
          meta_key: "grade",
          meta_value: grade,
        },
        {
          user_id: user.id,
          meta_key: "section",
          meta_value: section,
        },
        {
          user_id: user.id,
          meta_key: "wp_capabilities",
          meta_value: phpSerialize.serialize({ subscriber: true }), // Default capabilities
        },
      ];

      // Bulk insert the meta data
      await UserMetaModel.bulkCreate(metaData, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(201).json({
      status: 201,
      message: "Users registered successfully from Excel!",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
};

export default uploadController;
