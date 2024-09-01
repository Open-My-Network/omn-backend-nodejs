import axios from "axios";
import fs from 'fs';
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pointList = async (req, res) => {
    try {
      let response = await axios.get(
        "https://site.openmynetwork.com/generaltest31415/wp-content/uploads/omn-custom-user-points.json"
      );
  
      if (response.status === 200) {
        // Path to the JSON file
        const filePath = path.join(__dirname, '../json/gamipress-point.json');
  
        // Write data to the file
        fs.writeFile(filePath, JSON.stringify(response.data, null, 2), (err) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: `Error writing to file: ${err.message}`,
            });
          }
          return res.json({
            status: 200,
            item: response.data,
          });
        });
      } else {
        return res.status(response.status).json({
          status: response.status,
          message: 'Nothing Found',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: `Server error: ${error.message}`,
      });
    }
  };

  export default {pointList};

  