const db = require('../util/db'); 
exports.createAssignment = async (req, res) => {
    try {
        console.log("Received assignment:", req.body);

        const { base_id, asset_id, mission, user_id, assignment_value, status } = req.body;

        if (!base_id || !asset_id || !user_id || !mission) {
            return res.status(400).send("Missing required fields (base_id, asset_id, user_id, mission)");
        }

        const dataNew = {
            base_id,
            asset_id,
            mission,
            user_id,
            assignment_value,
            assignment_status: status || "pending"
        };

        const [result] = await db.query('INSERT INTO assignments SET ?', [dataNew]);

        if (result.affectedRows > 0) {
            return res.status(201).send("Assignment created successfully");
        }

        res.status(400).send("Assignment not created");

    } catch (err) {
        console.error("Error creating assignment:", err);
        res.status(500).send("Internal Server Error");
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const query = `
            SELECT 
                am.assignment_id,
                am.mission,
                am.assignment_value,
                am.assignment_status,
                a.asset_id,
                a.asset_name,
                a.asset_serial_number,
                b.base_id,
                b.base_name,
                u.user_id,
                u.username,
                u.email
            FROM assignments AS am
            JOIN assets AS a ON a.asset_id = am.asset_id
            JOIN bases AS b ON b.base_id = am.base_id
            JOIN users AS u ON u.user_id = am.user_id
        `;

        const [rows] = await db.query(query);

        if (rows.length > 0) {
            console.log("Assignments fetched successfully");
            return res.status(200).json(rows);
        }

        res.status(404).send("No assignments found");

    } catch (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).send("Internal Server Error");
    }
};
