const db= require('../util/db');

exports.createPurchase= async (req, res) => {
    try {
        const data = req.body;
        db.query('INSERT INTO purchases SET ?', data, (err, result) => {
            if (err) {
                console.log('Error creating transfer:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('Purchase created successfully');
            }
            res.status(400).send('Purchase not created');
        });
    } catch (err) {
        console.error('Error creating transfer:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getPurchase = async (req, res) => {
    try {
        db.query('SELECT * FROM purchases as p join assets as a on a.asset_id=p.asset_id join bases as b on b.base_id=p.base_id', (err, result) => {
            if (err) {
                console.log('Error fetching transfers:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.length > 0) {
                console.log('Transfers fetched successfully: ', result);
                return res.status(200).json(result);
            }
            res.status(404).send('No transfers found');
        });
    } catch (err) {
        console.error('Error fetching transfers:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.CheckAssetAndBase  = async (req,res) =>{
    try{   
        const {asset_id, base_id} = req.body;
        console.log('Checking asset and base:', asset_id, base_id);
        db.query('SELECT * FROM purchases WHERE asset_id = ? AND base_id = ?', [asset_id, base_id], (err, result) => {
            if (err) {
                console.log('Error checking asset and base:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.length > 0) {
                return res.status(200).json({message: 'Asset and Base match found'});
            }
            else{
            return  res.status(201).send('Asset and Base do not match');
            }
        });

    }
    catch(err){
        console.error('Error checking asset and base:', err);
        res.status(500).send('Internal Server Error');
    }
        
}