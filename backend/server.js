const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ==================== DATABASE CONNECTION ====================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'std6730202661',
  password: 'Pq7@j9Bz',
  database: 'ip_std6730202661'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL Database!');
  }
});

// ==================== AUTHENTICATION APIs ====================

// 1. API Register (สมัครสมาชิก - ปรับแก้ไม่บังคับ email)
app.post(['/register', '/api/register'], async (req, res) => {
  const { username, email, password } = req.body;

  // ตรวจสอบเฉพาะ username และ password
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก Username และ Password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userEmail = email || `${username}@example.com`; // หากไม่มี email ให้สร้าง email ชั่วคราวให้

    // ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
    const checkSql = 'SELECT id FROM users WHERE username = ? LIMIT 1';
    db.query(checkSql, [username], (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({ success: false, message: 'Database error', error: checkErr.message });
      }

      if (checkResults.length > 0) {
        return res.status(400).json({ success: false, message: 'Username นี้มีผู้ใช้งานแล้ว' });
      }

      // บันทึกลง Database (ลองใส่ email หรือถ้าตารางไม่มี email จะใช้เฉพาะ username, password)
      const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [username, userEmail, hashedPassword], (err, result) => {
        if (err) {
          // กรณีตาราง users ใน DB ไม่มีคอลัมน์ email ให้ถอยมาใช้คอลัมน์เฉพาะ username, password
          const fallbackSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
          db.query(fallbackSql, [username, hashedPassword], (fbErr, fbResult) => {
            if (fbErr) {
              return res.status(400).json({ success: false, message: 'ไม่สามารถสมัครสมาชิกได้', error: fbErr.message });
            }
            return res.status(201).json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
          });
        } else {
          return res.status(201).json({ success: true, message: 'สมัครสมาชิกสำเร็จ' });
        }
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 2. API Login (เข้าสู่ระบบ)
app.post(['/login', '/api/login'], (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ success: false, message: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    const user = results[0];
    
    // ตรวจสอบรหัสผ่าน (รองรับทั้ง bcrypt และ Plain Text)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      isMatch = (password === user.password);
    }

    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    if (isMatch) {
      delete user.password;
      res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ', token: 'sample-token', user });
    } else {
      res.status(401).json({ success: false, message: 'Username หรือ Password ไม่ถูกต้อง' });
    }
  });
});

// ==================== PRODUCT MANAGEMENT APIs ====================

// 3. API Fetch Products (ดึงรายการสินค้าทั้งหมด)
app.get(['/products', '/api/products'], (req, res) => {
  const sql = 'SELECT id, name, stock, price, category, image AS image_url FROM Inventory ORDER BY id DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error', error: err.message });
    }
    res.json(results);
  });
});

// 4. API Add Product (เพิ่มสินค้าใหม่)
app.post(['/products', '/api/products'], (req, res) => {
  const { name, stock, price, category, image_url } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อสินค้า' });
  }

  const sql = 'INSERT INTO Inventory (name, stock, price, category, image) VALUES (?, ?, ?, ?, ?)';
  const values = [name, stock || 0, price || 0, category || 'General Mics', image_url || ''];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Insert failed', error: err.message });
    }
    res.status(201).json({ success: true, message: 'เพิ่มสินค้าเรียบร้อย', id: result.insertId });
  });
});

// 5. API Update Product (แก้ไขสินค้า)
app.put(['/products/:id', '/api/products/:id'], (req, res) => {
  const { id } = req.params;
  const { name, stock, price, category, image_url } = req.body;

  const sql = 'UPDATE Inventory SET name = ?, stock = ?, price = ?, category = ?, image = ? WHERE id = ?';
  const values = [name, stock || 0, price || 0, category || 'General Mics', image_url || '', id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Update failed', error: err.message });
    }
    res.json({ success: true, message: 'อัปเดตข้อมูลสินค้าเรียบร้อย' });
  });
});

// 6. API Delete Product (ลบสินค้า)
app.delete(['/products/:id', '/api/products/:id'], (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Inventory WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
    }
    res.json({ success: true, message: 'ลบสินค้าเรียบร้อย' });
  });
});

// ==================== SERVER LISTEN ====================
// กำหนดพอร์ตเป็น 3061 ตามที่เซิร์ฟเวอร์ใช้
const PORT = process.env.PORT || 3061;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});