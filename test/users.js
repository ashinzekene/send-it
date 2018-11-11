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
    id = body.data[0].user.id;
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
  });
  
  it(`POST ${URL_PREFIX}auth/signup Should create a user and return a token`, async () => {
    const testUser2 = { ...testUser, email: 'ekonash28@gmail.com' };
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser2);
    token = body.data[0].token;
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('token', 'user');
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email',);
  });

  it(`GET ${URL_PREFIX} Should get all users`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users`)
    expect(status).to.equal(200);
    expect(body.data).to.be.an('array');
  });
  
  it(`GET ${URL_PREFIX}users/:id Should get a single user by id`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users/${id}`)
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
  });

  it(`GET ${URL_PREFIX}auth/ Should get an already signed in user with token`, async () => {
    const { body, status } = await chaiReq
    .get(`${URL_PREFIX}auth/`)
    .set('Authorization', `Bearer ${token}`)
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
    expect(body.data[0].user).to.have.property('email', 'ekonash28@gmail.com');
  });

})