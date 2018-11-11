import chai from 'chai';
import chaiHttp from 'chai-http'
import config from './index';
import server from '../lib/app'

chai.use(chaiHttp);

const testUser = {
  firstname: 'Ekene',
  lastname: 'Ekonash',
  othername: 'Eky',
  email: 'ekonash1@gmail.com',
}

let id;
let token;

const URL_PREFIX = '/api/v1/'
const chaiReq = chai.request(server).keepOpen();
const expect = chai.expect;

describe('USERS', () => {
  after(async () => {
    const { body } = await chaiReq.post(`${URL_PREFIX}drop/users`).send();
  });

  it(`POST ${URL_PREFIX}auth/signup Should create a user`, async () => {
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser);
    id = body.data.id;
    expect(status).to.equal(200);
    expect(body.data).to.include.all.keys('firstname', 'lastname', 'email');
  });
  
  it(`GET ${URL_PREFIX} Should get all users`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users`)
    expect(status).to.equal(200);
    expect(body.data).to.be.an('array');
  });
  
  it(`GET ${URL_PREFIX}users/:id Should get a single user by id`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users/${id}`)
    expect(status).to.equal(200);
    expect(body.data).to.include.all.keys('firstname', 'lastname', 'email');
  });

  it(`POST ${URL_PREFIX}auth/signup Should create a user and return a token`, async () => {
    const testUser2 = { ...testUser, email: 'ekonash28@gmail.com' };
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser2);
    token = body.data.token;
    expect(status).to.equal(200);
    expect(body.data).to.include.all.keys('firstname', 'lastname', 'email', 'token');
  });

})