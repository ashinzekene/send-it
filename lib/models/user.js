import pool from './index';

export default (() => ({
  async getAll() {
    const users = await pool.query('SELECT * FROM USERS');
    return users.rows;
  },
}))();
