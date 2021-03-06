import pool from './index';

const userModel = {
  async getAll() {
    const users = await pool.query('SELECT * FROM users');
    return users.rows;
  },
  async getOne(val, prop = 'id') {
    const query = {
      text: `SELECT DISTINCT * FROM users
      WHERE ${prop}=$1`,
      values: [val],
    };
    const users = await pool.query(query);
    return users.rows[0];
  },
  async create(params) {
    const values = Object.values(params);
    const query = {
      text: `INSERT INTO users 
      (firstname, lastname, othername, email, registered, password, isAdmin) VALUES
      ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, firstname, lastname, othername, email, registered, isAdmin`,
      values,
    };
    const users = await pool.query(query);
    return users.rows[0];
  },
};

export default userModel;
