import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const URL_PREFIX = '/api/v1/';
const chaiReq = chai.request(server).keepOpen();
const { expect } = chai;

describe.only('PARCELS', () => {
  it(`GET ${URL_PREFIX}locations/distance-matrix Should create a parcel`, async () => {
    const { body } = await chaiReq.post(`${URL_PREFIX}locations/distance-matrix`)
      .send({ from: 'Lagos', destination: 'Abuja' });
    console.log({ body });
    expect(body).to.exist; // eslint-disable-line
  });
});
