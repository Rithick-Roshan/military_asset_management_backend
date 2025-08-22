const mysql = require('mysql2/promise');

const conection = mysql.createPool({
  host: 'bkydrk4ponfwfc4ncupc-mysql.services.clever-cloud.com',
  user: 'upazfcyz17b1sfww',
  password: 'thWjMX6d3GO3dGldMS3W',
  database: 'bkydrk4ponfwfc4ncupc',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0
});

// ✅ Test DB connection on startup
(async () => {
  try {
    const connection = await conection.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Error connecting to DB:", err.message);
  }
})();

module.exports = conection;
