const db = require('../util/db');
exports.createAsset = async (req, res) => {
  try {
    const data = req.body;

    const [result] = await db.query("INSERT INTO assets SET ?", data);

    if (result.affectedRows > 0) {
      return res.status(200).send("Asset created successfully");
    }
    res.status(400).send("Asset not created");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.error("Duplicate entry error:", err);
      return res.status(409).send("Asset already exists");
    }
    console.error("Error creating asset:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAssets = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM assets AS a JOIN bases AS b ON b.base_id=a.base_id"
    );

    if (result.length > 0) {
      console.log("Assets fetched successfully");
      return res.status(200).json(result);
    }
    res.status(404).send("No assets found");
  } catch (err) {
    console.error("Error fetching assets:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAssetId = async (req,res)=>{
    try{
        const {asset_serial_number} = req.query;
        console.log(asset_serial_number);
        db.query("select * from assets where asset_serial_number = ?",[asset_serial_number],(err,result)=>{
            if(err){
                console.log('Error fetching asset by ID:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length > 0){
                return res.status(200).json(result[0]);
            }
            res.status(404).send('Asset not found');
        })
    }
    catch(err){
        console.error('Error fetching asset by ID:', err);
        res.status(500).send('Internal Server Error');
    }
}


exports.getAssetById = async (req, res) => {
  try {
    const { asset_serial_number } = req.query;
    console.log("Fetching asset serial:", asset_serial_number);

    const [result] = await db.query(
      "SELECT * FROM assets WHERE asset_serial_number = ?",
      [asset_serial_number]
    );

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    }
    res.status(404).send("Asset not found");
  } catch (err) {
    console.error("Error fetching asset by serial:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.updateAsset = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const assetId = req.body.asset_id;

    const [result] = await db.query("UPDATE assets SET ? WHERE asset_id = ?", [
      req.body,
      assetId,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).send("Asset updated successfully");
    }
    res.status(404).send("Asset not found");
  } catch (err) {
    console.error("Error updating asset:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateAssetForAssigment = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const assetId = req.body.asset_id;

    const newData = {
      current_status: req.body.current_status,
      available: req.body.available,
      status: req.body.status,
      assigned: req.body.assigned,
    };

    const [result] = await db.query("UPDATE assets SET ? WHERE asset_id = ?", [
      newData,
      assetId,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).send("Asset updated successfully");
    }
    res.status(404).send("Asset not found");
  } catch (err) {
    console.error("Error updating asset assignment:", err);
    res.status(500).send("Internal Server Error");
  }
};