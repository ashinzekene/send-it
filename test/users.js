import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const testUser = {
  firstname: 'Ekene',
  lastname: 'Ekonash',
  othername: 'Eky',
  password: 'mypassword',
  email: 'ekonash1@gmail.com',
};
const testParce1l = {
  weight: '23',
  to: 'Lagos',
  from: 'Abuja',
};
const testParcel2 = {
  weight: '23',
  to: 'Lagos',
  from: 'Abuja',
};
const testParcel3 = {
  weight: '23',
  to: 'Lagos',
  from: 'Abuja',
};

let userId;
let token;

const URL_PREFIX = '/api/v1/';
const chaiReq = chai.request(server).keepOpen();
const { expect } = chai;

describe('USERS', () => {
  after(async () => {
    await chaiReq.post(`${URL_PREFIX}drop/users`).send();
  });

  it(`POST ${URL_PREFIX}auth/signup Should create a user`, async () => {
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser);
    userId = body.data[0].user.id;
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
  });

  it(`POST ${URL_PREFIX}auth/signup Should create a user and return a token`, async () => {
    const testUser2 = { ...testUser, email: 'ekonash28@gmail.com' };
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser2);
    token = body.data[0].token;
    userId = body.data[0].user.id;
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('token', 'user');
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
  });

  it(`GET ${URL_PREFIX} Should get all users`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users`);
    expect(status).to.equal(200);
    expect(body.data).to.be.an('array');
  });

  it(`GET ${URL_PREFIX}users/:id Should get a single user by id`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users/${userId}`);
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
  });

  it(`GET ${URL_PREFIX}auth/ Should get an already signed in user with token`, async () => {
    const { body, status } = await chaiReq
      .get(`${URL_PREFIX}auth/`)
      .set('Authorization', `Bearer ${token}`);
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
    expect(body.data[0].user).to.have.property('email', 'ekonash28@gmail.com');
  });

  it(`GET ${URL_PREFIX}auth/ Should show unauthorized without auth header`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}auth/`);
    expect(status).to.equal(401);
    expect(body.status).to.eql(401);
    expect(body.error).to.include('Authorization');
  });

  it(`POST ${URL_PREFIX}auth/login login correctly`, async () => {
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/login`)
      .send({ email: testUser.email, password: testUser.password });
    expect(status).to.equal(200);
    expect(body.data[0].user).to.include.all.keys('firstname', 'lastname', 'email');
    expect(body.data[0].user).to.have.property('email', testUser.email);
  });

  it(`POST ${URL_PREFIX}auth/login invalid credentials should fail`, async () => {
    const { body, status } = await chaiReq.post(`${URL_PREFIX}auth/login`)
      .send({ email: testUser.email, password: 'testUser.password' });
    expect(status).to.equal(401);
    expect(body.status).to.equal(401);
    expect(body.error).to.include('Password');
  });

  it(`GET ${URL_PREFIX}users/:user/parcels Should fetch users parcels`, async () => {
    const createParcel = parcel => chaiReq.post(`${URL_PREFIX}parcels`)
      .set('Authorization', `Bearer ${token}`)
      .send(parcel);
    const b = await Promise.all([
      createParcel(testParce1l),
      createParcel(testParcel2),
      createParcel(testParcel3)]);
    const parcels = b.map(({ body }) => body.data[0]);
    const { body, status } = await chaiReq.get(`${URL_PREFIX}users/${userId}/parcels`);
    expect(status).to.equal(200);
    expect(body.status).to.eql(200);
    expect(body.data[0].from).to.eql(testParce1l.from);
    expect(body.data[0].to).to.eql(testParce1l.to);
    expect(body.data.length).to.eql(parcels.length);
  });
});
