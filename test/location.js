import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const URL_PREFIX = '/api/v1/';
const chaiReq = chai.request(server).keepOpen();
const { expect } = chai;

describe('PARCELS', () => {
  it(`POST ${URL_PREFIX}locations/distance-matrix get distance matrix`, async () => {
    const { body } = await chaiReq.post(`${URL_PREFIX}locations/distance-matrix`)
      .send({ origin: 'Lagos', destination: 'Abuja' });
    expect(body.status).to.eql(200);
    expect(body.data.rows).to.be.an('array');
  });
});
