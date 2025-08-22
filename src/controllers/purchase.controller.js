const db= require('../util/db');

exports.createPurchase = async (req, res) => {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Purchase data is required");
        }

        const [result] = await db.query("INSERT INTO purchases SET ?", [data]);

        if (result.affectedRows > 0) {
            return res.status(201).send("Purchase created successfully");
        }

        res.status(400).send("Purchase not created");

    } catch (err) {
        console.error("Error creating purchase:", err);
        res.status(500).send("Internal Server Error");
    }
};

exports.getPurchase = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * 
            FROM purchases AS p
            JOIN assets AS a ON a.asset_id = p.asset_id
            JOIN bases AS b ON b.base_id = p.base_id
        `);

        if (rows.length > 0) {
            console.log("Purchases fetched successfully");
            return res.status(200).json(rows);
        }

        res.status(404).send("No purchases found");

    } catch (err) {
        console.error("Error fetching purchases:", err);
        res.status(500).send("Internal Server Error");
    }
};


exports.CheckAssetAndBase = async (req, res) => {
    try {
        const { asset_id, base_id } = req.body;

        if (!asset_id || !base_id) {
            return res.status(400).send("asset_id and base_id are required");
        }

        const [rows] = await db.query(
            "SELECT * FROM purchases WHERE asset_id = ? AND base_id = ?",
            [asset_id, base_id]
        );

        if (rows.length > 0) {
            return res.status(200).json({ message: "Asset and Base match found" });
        }

        res.status(404).json({ message: "Asset and Base do not match" });

    } catch (err) {
        console.error("Error checking asset and base:", err);
        res.status(500).send("Internal Server Error");
    }
};