import pool from './index';

export default {
  async getAll() {
    const parcels = await pool.query('SELECT * FROM parcels');
    return parcels.rows;
  },
  async getOne(val, prop = 'id') {
    const query = {
      text: `SELECT DISTINCT * FROM parcels
      WHERE ${prop}=$1`,
      values: [val],
    };
    const parcel = await pool.query(query);
    return parcel.rows[0];
  },
  async getMany(val, prop = 'id') {
    const query = {
      text: `SELECT * FROM parcels
      WHERE ${prop}=$1`,
      values: [val],
    };
    const parcels = await pool.query(query);
    return parcels.rows;
  },
  async updateDestination(destination, parcelId) {
    const query = {
      text: `UPDATE parcels
      SET destination = $1
      WHERE id = $2`,
      values: [destination, parcelId],
    };
    const parcel = await pool.query(query);
    return parcel.rows;
  },
  async create(params) {
    const values = Object.values(params);
    const query = {
      text: `INSERT INTO parcels
      (placedBy, weight, weightMetric, sentOn, "status", "from", "to", currentLocation) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, placedBy, weight, weightMetric, sentOn, "status", "from", "to", currentLocation`,
      values,
    };
    const parcels = await pool.query(query);
    return parcels.rows[0];
  },

};
