const db= require('../util/db');

exports.createTransfer = async (req,res)=>{
    try{
        const data = req.body;
        db.query('insert into transfers set ?',data,(err,result)=>{
            if(err){
                console.log('Error creating transfer:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.affectedRows>0){
                return res.status(200).send('Transfer created successfully');
            }
            res.status(400).send('Transfer not created');
        })

    }
    catch(err){
        console.error('Error creating transfer:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getTransfer = async (req, res) => {
    try{
        db.query('select t.*, b1.base_name as from_base_name, b1.base_code as from_base_code, b1.location as from_base_location, b2.base_name as to_base_name, b2.base_code as to_base_code, b2.location as to_base_location, a.* from transfers t join bases b1 on t.from_base_id=b1.base_id join bases b2 on t.to_base_id=b2.base_id join assets a on t.asset_id=a.asset_id',(err,result)=>{
            if(err){
                console.log('Error fetching transfers:', err);
                return res.status(500).send('Internal Server Error');
            }
            if(result.length > 0){
                console.log('Transfers fetched successfully: ', result);
                return res.status(200).json(result);
            }
            res.status(404).send('No transfers found');
        })
    }
    catch(err){
        console.error('Error fetching transfers:', err);
        res.status(500).send('Internal Server Error');
    }
}