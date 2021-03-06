const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const connectionString = process.env.CONNECTION_STRING;
const pool = new Pool({ connectionString });

async function getItems(req, res, next) {
  const { offset = 0, limit = 25, tag } = req.query;

  try {
    const { rows } = await pool.query('SELECT * FROM items');
    const items = rows
      .map((row) => ({ ...row, price: parseFloat(row.price.replace('$', '')) }))
      .slice(Number(offset), Number(offset) + Number(limit));
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function getItem(req, res, next) {
  const id = Number(req.params.id);

  try {
    const { rows } = await pool.query(`SELECT * FROM items WHERE id = ${id}`);
    const row = rows[0];
    if (row) {
      const item = { ...row, price: parseFloat(row.price.replace('$', '')) };
      res.json(item);
    } else {
      return next();
    }
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  const item = req.body;
  try {
    const { rows } = await pool.query(`INSERT INTO items (name, description, price) VALUES ('${item.name}', '${item.description}', ${item.price}) RETURNING *`);
    console.log(rows);
    if (rows && rows.length === 1) {
      const item = { ...rows[0], price: parseFloat(rows[0].price.replace('$', '')) };
      res.json(item);
    } else {
      return next();
    }
  } catch (err) {
    next(err);
  }
}

async function getCart(req, res) {
  res.json({ message: 'Resource not implemented yet' });
}

async function createUser(req, res, next) {
  const userData = req.body;
  try {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS)
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password) VALUES ('${userData.username}', '${userData.email}', '${hashedPassword}') RETURNING id, username, email`);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  pool,
  getItems,
  getItem,
  createItem,
  getCart,
  createUser,
};
