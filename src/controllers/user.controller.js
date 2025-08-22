const bcryptjs= require('bcryptjs');
const db = require('../util/db');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);

    // ✅ Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [data.email]
    );

    if (existingUser.length > 0) {
      return res.status(409).send("User already exists");
    }

    // ✅ Hash password
    const hash_password = await bcryptjs.hash(data.password_hash, 10);
    const status = data.status === "Active" ? 1 : 0;

    // ✅ Insert new user
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash, role, status, base_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.username,
        data.email,
        hash_password,
        data.role,
        status,
        data.base_id,
      ]
    );

    if (result.affectedRows > 0) {
      return res.status(200).send("User created successfully");
    } else {
      return res.status(400).send("User not created");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  const jwt_secret = "67799r567cbcccvgcfgbvv";
  const jwt_exp_in = "24h";

  try {
    console.log(req.body);
    const { email, password } = req.body;

    
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result[0];

    // ✅ Compare hashed password
    const isMatch = await bcryptjs.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    // ✅ Build JWT token
    const payload = {
      userId: user.user_id,
      email: user.email,
    };

    const token = jwt.sign(payload, jwt_secret, { expiresIn: jwt_exp_in });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        base_id: user.base_id,
        status: user.status,
        // ⚠️ these require a JOIN with `bases` table if you want them:
        base_name: user.base_name || null,
        base_code: user.base_code || null,
        location: user.location || null,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.createBase = async (req, res) => {
  try {
    const data = req.body;

    const [result] = await db.query("INSERT INTO bases SET ?", data);

    if (result.affectedRows > 0) {
      return res.status(200).send("Base created successfully");
    }
    return res.status(400).send("Base not created");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("Duplicate entry error:", err);
      return res.status(409).send("Base already exists"); // 409 Conflict
    }
    console.error("Error creating base:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getBases = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM bases");

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).send("No bases found");
  } catch (err) {
    console.error("Error fetching bases:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.*, b.base_name, b.base_code, b.location 
       FROM users AS u 
       LEFT JOIN bases AS b ON u.base_id = b.base_id`
    );

    if (rows.length > 0) {
      return res.status(200).json(rows);
    } else {
      return res.status(404).send("No users found");
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateBase = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data for update:", data);

    const [result] = await db.query("UPDATE bases SET ? WHERE base_id = ?", [
      data,
      data.base_id,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).send("Base updated successfully");
    }
    return res.status(400).send("Base not updated");
  } catch (err) {
    console.error("Error updating base:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteBase = async (req, res) => {
  try {
    const { base_id } = req.body;
    console.log("Deleting base:", base_id);

    const [result] = await db.query("DELETE FROM bases WHERE base_id = ?", [
      base_id,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).send("Base deleted successfully");
    }
    return res.status(404).send("Base not found");
  } catch (err) {
    console.error("Error deleting base:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data for user update:", data);

    // convert status to boolean
    data.status = data.status === "Active" ? true : false;

    const [result] = await db.query(
      "UPDATE users SET ? WHERE user_id = ?",
      [data, data.user_id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).send("User updated successfully");
    }
    return res.status(400).send("User not updated");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log("Received user_id for deletion:", user_id);

    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).send("User deleted successfully");
    }
    return res.status(404).send("User not found");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
};