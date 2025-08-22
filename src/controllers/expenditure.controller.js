const db = require('../util/db'); 

exports.createExpenditure = async (req, res) => {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Expenditure data is required");
        }

        const [result] = await db.query('INSERT INTO expenditures SET ?', [data]);

        if (result.affectedRows > 0) {
            return res.status(201).send("Expenditure created successfully");
        }

        res.status(400).send("Expenditure not created");

    } catch (err) {
        console.error("Error creating expenditure:", err);
        res.status(500).send("Internal Server Error");
    }
};

exports.getExpenditures = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM expenditures");

        if (rows.length > 0) {
            console.log("Expenditures fetched successfully");
            return res.status(200).json(rows);
        }

        res.status(404).send("No expenditures found");

    } catch (err) {
        console.error("Error fetching expenditures:", err);
        res.status(500).send("Internal Server Error");
    }
};
