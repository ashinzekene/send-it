import pool from './index';

export default (() => ({
  async getAll() {
    const users = await pool.query('SELECT * FROM USERS');
    return users.rows;
  },
  async getOneByID(id) {
    const query = {
      text: `SELECT DISTINCT * FROM users
      WHERE id=$1`,
      values: [id],
    };
    const users = await pool.query(query);
    return users.rows[0];
  },
  async create(params) {
    const values = Object.values(params);
    const query = {
      text: `INSERT INTO users 
      (firstname, lastname, othername, email, registered, isAdmin) VALUES
      ($1, $2, $3, $4, $5, $6)`,
      values,
    };
    const users = await pool.query(query);
    return users.rows;
  },

}))();
