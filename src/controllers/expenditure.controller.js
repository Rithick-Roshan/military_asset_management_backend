const db = require('../util/db');

exports.createExpenditure = async (req, res) => {
    try {
        const data = req.body;
        db.query('INSERT INTO expenditures SET ?', data, (err, result) => {
            if (err) {
                console.log('Error creating expenditure:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows > 0) {
                return res.status(200).send('Expenditure created successfully');
            }
            res.status(400).send('Expenditure not created');
        });
    } catch (err) {
        console.error('Error creating expenditure:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getExpenditures = async (req, res) => {
    try {
        db.query('SELECT * FROM expenditures', (err, result) => {
            if (err) {
                console.log('Error fetching expenditures:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.length > 0) {
                console.log('Expenditures fetched successfully:', result);
                return res.status(200).json(result);
            }
            res.status(404).send('No expenditures found');
        });
    } catch (err) {
        console.error('Error fetching expenditures:', err);
        res.status(500).send('Internal Server Error');
    }
}