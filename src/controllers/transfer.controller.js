const db= require('../util/db');

exports.createTransfer = async (req, res) => {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Transfer data is required");
        }

        const [result] = await db.query("INSERT INTO transfers SET ?", [data]);

        if (result.affectedRows > 0) {
            return res.status(201).send("Transfer created successfully");
        }

        res.status(400).send("Transfer not created");

    } catch (err) {
        console.error("Error creating transfer:", err);
        res.status(500).send("Internal Server Error");
    }
};

exports.getTransfer = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                t.*, 
                b1.base_name AS from_base_name, 
                b1.base_code AS from_base_code, 
                b1.location AS from_base_location, 
                b2.base_name AS to_base_name, 
                b2.base_code AS to_base_code, 
                b2.location AS to_base_location, 
                a.*
            FROM transfers t
            JOIN bases b1 ON t.from_base_id = b1.base_id
            JOIN bases b2 ON t.to_base_id = b2.base_id
            JOIN assets a ON t.asset_id = a.asset_id
        `);

        if (rows.length > 0) {
            console.log("Transfers fetched successfully");
            return res.status(200).json(rows);
        }

        res.status(404).send("No transfers found");

    } catch (err) {
        console.error("Error fetching transfers:", err);
        res.status(500).send("Internal Server Error");
    }
};