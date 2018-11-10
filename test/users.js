import chai from 'chai';
import chaiHttp from 'chai-http'
import config from './index';
import server from '../lib/app'

chai.use(chaiHttp);

const URL_PREFIX = '/api/v1/'
const chaiReq = chai.request(server).keepOpen();
const expect = chai.expect;


describe('USERS', () => {
  it(`GET ${URL_PREFIX} Should get all users`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users`)
    expect(status).to.equal(200);
    expect(body).to.be.an('array');
  });

})