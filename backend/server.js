require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test MySQL Connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    conn.release();
  } catch (err) {
    console.error(err);
  }
})();

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api", (req, res) => {
  res.send("API is running");
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        stock,
        category,
        status,

        CASE
          WHEN name='HyperX SoloCast'
            THEN 'https://row.hyperx.com/cdn/shop/products/hyperx_solocast_01_main.jpg'

          WHEN name='Fantech Leviosa MCX01'
            THEN 'https://www.jib.co.th/img_master/product/original/2023112513582143057_1.jpg'

          WHEN name='Shure SM7B Cardioid'
            THEN 'https://mercular.s3.ap-southeast-1.amazonaws.com/images/products/2020/04/sm7b-1.jpg'

          ELSE image
        END AS image_url,

        CASE
          WHEN name='HyperX SoloCast' THEN 1790
          WHEN name='Fantech Leviosa MCX01' THEN 1590
          WHEN name='Shure SM7B Cardioid' THEN 22864
          ELSE 0
        END AS price

      FROM Inventory
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});