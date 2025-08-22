const db = require('../util/db');
exports.createAsset = async (req,res)=>{
    try{
        const data= req.body;
        db.query('insert into assets set ?',data,(err,result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    console.error('Duplicate entry error:', err);
                    return res.status(409).send('Asset already exists');
                }
                console.log('Error creating asset:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.affectedRows>0){
                return res.status(200).send('Asset created successfully');
            }
            res.status(400).send('Asset not created');
        })
    }
    catch(err){
        console.error('Error creating asset:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getAssets = async (req, res) => {
    try{
         db.query('select * from assets as a  join bases as b on b.base_id=a.base_id',(err,result)=>{
            if(err){
                console.log('Error fetching assets:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length > 0){
                console.log('Assets fetched successfully'+result);
                return res.status(200).json(result);
            }
            res.status(404).send('No assets found');
         })
    }
    catch(err){
        console.error('Error fetching assets:', err);
        res.status(500).send('Internal Server Error');
    }
}

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


exports.getAssetById = async (req,res) =>{
    try{
        const {asset_id} = req.query;
        db.query('select * from assets where asset_id = ?', [asset_id], (err, result) => {
            if (err) {
                console.log('Error fetching asset by ID:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.length > 0) {
                return res.status(200).json(result[0]);
            }
            res.status(404).send('Asset not found');
        });
    } catch (err) {
        console.error('Error fetching asset by ID:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.updateAsset = async (req,res) =>{
    try{
        console.log("redcevied data",req.body);
        const assetId  = req.body.asset_id;
        const updatedData = req.body;
        const newData ={
            asset_id:updatedData.asset_id,
            asset_serial_number:updatedData.asset_serial_number,
            current_status:updatedData.current_status,
            purchase_date:updatedData.purchase_date,
            condition_status:updatedData.condition_status,
            manufacturer:updatedData.manufacturer,
            model:updatedData.model,
            year_manufactured:updatedData.year_manufactured,
            warranty_expiry:updatedData.warranty_expiry,
            available:updatedData.available,
            status:updatedData.status,
            base_id:updatedData.base_id,
            asset_name:updatedData.asset_name,
            category:updatedData.category,
            total_quantity:updatedData.total_quantity,
            assigned:updatedData.assigned
        }
        db.query('UPDATE assets SET ? WHERE asset_id = ?', [newData, assetId], (err, result) => {
            if (err) {
                console.log('Error updating asset:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('Asset updated successfully');
            }
            res.status(404).send('Asset not found');
        });
    }
    catch(err){
        console.error('Error updating asset:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.updateAssetForAssigment = async (req,res)=>{
    try{
        console.log("redcevied data",req.body);
        const assetId  = req.body.asset_id;
        const updatedData = req.body;
        const newData ={
            current_status:updatedData.current_status,
            available:updatedData.available,
            status:updatedData.status,
            assigned:updatedData.assigned
        }
        db.query('UPDATE assets SET ? WHERE asset_id = ?', [newData, assetId], (err, result) => {
            if (err) {
                console.log('Error updating asset:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('Asset updated successfully');
            }
            res.status(404).send('Asset not found');
        });
    }
    catch(err){
        console.error('Error updating asset:', err);
        res.status(500).send('Internal Server Error');
    }
}