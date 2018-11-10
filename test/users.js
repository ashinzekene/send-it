import chai from 'chai';
import chaiHttp from 'chai-http'
import config from './index';
import server from '../lib/app'

chai.use(chaiHttp);

const testUser = {
  firstname: 'Ekene',
  lastname: 'Ashinze',
  othername: 'Eky',
  email: 'ashinzekene@gmail.com',
}

const URL_PREFIX = '/api/v1/'
const chaiReq = chai.request(server).keepOpen();
const expect = chai.expect;


describe('USERS', () => {
  it(`GET ${URL_PREFIX} Should get all users`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users`)
    expect(status).to.equal(200);
    expect(body).to.be.an('array');
  });

  it(`POST ${URL_PREFIX} Should create a user`, async () => {
    const { body, status } = await chaiReq.post(`${URL_PREFIX}users`).send(testUser);
    expect(status).to.equal(200);
    expect(body).to.be.an('array');
  });

})