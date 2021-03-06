import pool from './index';
import userModel from './user';

const parcelModel = {
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
    const parcels = await pool.query(query);
    return parcels.rows[0];
  },
  async getOneWithUser(val) {
    const parcel = await parcelModel.getOne(val);
    parcel.placedby = await userModel.getOne(parcel.placedby);
    return parcel;
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
      SET "to" = $1
      WHERE id = $2
      RETURNING id, "to"`,
      values: [destination, parcelId],
    };
    const parcel = await pool.query(query);
    return parcel.rows[0];
  },
  async updateStatus(status, parcelId) {
    const query = {
      text: `UPDATE parcels
      SET "status" = $1
      WHERE id = $2
      RETURNING id, "status"`,
      values: [status, parcelId],
    };
    const parcel = await pool.query(query);
    return parcel.rows[0];
  },
  async markDelivered(parcelId) {
    const query = {
      text: `UPDATE parcels
      SET "deliveredon" = $1
      WHERE id = $2
      RETURNING id, "deliveredon"`,
      values: [new Date(), parcelId],
    };
    const parcel = await pool.query(query);
    return parcel.rows[0];
  },
  async updateCurrentLocation(location, parcelId) {
    const query = {
      text: `UPDATE parcels
      SET "currentlocation" = $1
      WHERE id = $2
      RETURNING id, currentlocation`,
      values: [location, parcelId],
    };
    const parcel = await pool.query(query);
    return parcel.rows[0];
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

export default parcelModel;
