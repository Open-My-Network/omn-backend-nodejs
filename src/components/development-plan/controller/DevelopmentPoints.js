import fs from "fs";
import path from "path";
import { unserialize, serialize } from "php-serialize";
import db from "../../../config/db.js";

const getCurrentDir = () => {
  return new URL(".", import.meta.url).pathname;
};

const grantPoint = async (req, res) => {
  try {
    let key = req.body.key;

    // Define the path to the JSON file
    let jsonFilePath = path.join(
      getCurrentDir(),
      "../../points/json/gamipress-point.json"
    );

    // Read and parse the JSON file
    let responseData;
    try {
      const fileData = fs.readFileSync(jsonFilePath, "utf8");
      responseData = JSON.parse(fileData);
    } catch (fileError) {
      console.error("Error reading or parsing JSON file:", fileError);
      return res.status(500).json({
        status: 500,
        message: `Error reading or parsing JSON file: ${fileError.message}`,
      });
    }

    // Check if key exists in the item
    const item = responseData;
    if (item.hasOwnProperty(key)) {
      const pointDetails = item[key];

      const [result] = await db.sequelize.query(
        "SELECT * FROM `wp_usermeta` WHERE user_id = 21 AND meta_key='omn_user_points_stats'"
      );

      if (result.length > 0) {
        let userPointsData;
        try {
          userPointsData = unserialize(result[0].meta_value);
        } catch (unserializeError) {
          console.error("Unserialize error:", unserializeError);
          return res.status(500).json({
            status: 500,
            message: `Unserialize error: ${unserializeError.message}`,
          });
        }

        // Add points
        userPointsData.total += pointDetails.points;

        userPointsData.history.push({
          key: Math.random().toString(36).substr(2, 10),
          action: key,
          points: pointDetails.points,
          timestamp: Math.floor(Date.now() / 1000),
          comment: "",
        });

        const updatedMetaValue = serialize(userPointsData);

        await db.sequelize.query(
          "UPDATE `wp_usermeta` SET meta_value = ? WHERE user_id = 21 AND meta_key='omn_user_points_stats'",
          { replacements: [updatedMetaValue] }
        );

        return res.json({
          status: 200,
          message: "Points granted successfully",
          updatedRecord: userPointsData,
        });
      } else {
        return res.status(404).json({ message: "User points record not found" });
      }
    } else {
      return res.status(404).json({ message: "Point key not found in the system" });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export default { grantPoint };
