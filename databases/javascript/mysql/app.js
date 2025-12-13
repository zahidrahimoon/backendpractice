const mysql = require('mysql2');
const express = require('express');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'usercrud'
});

app.use(express.json());

const createTableSQL = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT,
  birthdate DATE,
  is_active BOOLEAN,
  balance DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile BLOB,
  rating FLOAT,
  score DOUBLE,
  meta JSON,
  uuid CHAR(36)
)`;
db.execute(createTableSQL, (err) => {
  if (err) console.error('Table creation error:', err);
});

db.query('SELECT COUNT(*) AS count FROM users', (err, results) => {
  if (err) return console.error('Count error:', err);
  if (results[0].count === 0) {
    const insertSQL = `INSERT INTO users (username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid)
      VALUES
      ('Alice', 'alice@example.com', 30, '1995-01-01', true, 1000.50, x'42696F', 4.5, 99.99, '{"hobby":"reading"}', '550e8400-e29b-41d4-a716-446655440000'),
      ('Bob', 'bob@example.com', 25, '2000-05-15', false, 200.00, x'426F62', 3.2, 88.88, '{"hobby":"gaming"}', '550e8400-e29b-41d4-a716-446655440001'),
      ('Charlie', 'charlie@example.com', 40, '1985-12-31', true, 500.75, x'43686172', 5.0, 77.77, '{"hobby":"sports"}', '550e8400-e29b-41d4-a716-446655440002'),
      ('Diana', 'diana@example.com', 22, '2003-07-20', false, 150.25, x'4469616E61', 2.8, 66.66, '{"hobby":"music"}', '550e8400-e29b-41d4-a716-446655440003'),
      ('Eve', 'eve@example.com', 35, '1990-03-10', true, 800.00, x'457665', 4.0, 55.55, '{"hobby":"art"}', '550e8400-e29b-41d4-a716-446655440004');`;
    db.query(insertSQL, (err) => {
      if (err) console.error('Insert error:', err);
      else console.log('Inserted 5 sample users.');
    });
  }
});


app.post('/users', (req, res) => {
  const { username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid } = req.body;
  db.query(
    'INSERT INTO users (username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

app.put('/users/:id', (req, res) => {
  const { username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid } = req.body;
  db.query(
    'UPDATE users SET username=?, email=?, age=?, birthdate=?, is_active=?, balance=?, profile=?, rating=?, score=?, meta=?, uuid=? WHERE id=?',
    [username, email, age, birthdate, is_active, balance, profile, rating, score, meta, uuid, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
