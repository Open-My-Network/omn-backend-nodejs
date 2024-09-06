import ExcelJS from "exceljs";

const uploadController = async (req, res) => {
  try {
    let file = req.file.buffer;

    let workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file);

    let data = [];
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetInfo = {
        sheetId,
        sheetName: worksheet.name,
        rowCount: worksheet.rowCount,
        columnCount: worksheet.columnCount,
        rows: []
      };

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
          sheetInfo.rows.push(rowData);
        }
      });

      data.push(sheetInfo);
    });

    res.status(200).json({
      message: 'File processed successfully',
      data
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
};

export default uploadController;
