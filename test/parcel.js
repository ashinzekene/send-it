import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const testUser = {
  firstname: 'Ekene',
  lastname: 'Ekonash',
  othername: 'Eky',
  password: 'mypassword',
  email: 'ekene@send_it.com',
};
const testAdmin = {
  firstname: 'Ekene',
  lastname: 'Ekonash',
  othername: 'Eky',
  password: 'mypassword',
  email: 'admin@send_it.com',
  isAdmin: 1,
};
const testParcel = {
  weight: '23',
  to: 'Lagos',
  from: 'Abuja',
};


const URL_PREFIX = '/api/v1/';
const chaiReq = chai.request(server).keepOpen();
const { expect } = chai;
let parcelId = 1;
let userToken;
let adminToken;

describe('PARCELS', () => {
  after(async () => {
    await chaiReq.post(`${URL_PREFIX}drop/parcels`).send();
    await chaiReq.post(`${URL_PREFIX}drop/users`).send();
  });

  it(`POST ${URL_PREFIX}parcels Should create a parcel`, async () => {
    const { body: userBody } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser);
    userToken = userBody.data[0].token;
    const { body, status } = await chaiReq.post(`${URL_PREFIX}parcels`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(testParcel);
    parcelId = body.data[0].id;
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to');
  });

  it(`GET ${URL_PREFIX}parcels/:id Should get a single parcel by id`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}parcels/${parcelId}`);
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to');
    expect(body.data[0]).to.have.property('from', testParcel.from);
  });

  it(`GET ${URL_PREFIX}parcels Should get all parcels`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}parcels`);
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to', 'senton');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/destination Should not allow unauth user change destination`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/destination`).send({
      to: 'PortHarcourt',
    });
    expect(status).to.eql(401);
    expect(body.error).to.include('No Authorization');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/destination Should allow only parcel creator change destination`, async () => {
    const fakeUser = { ...testUser, email: 'fakeemail@gmail.com' };
    const { body: userBody } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(fakeUser);
    const fakeToken = userBody.data[0].token;
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/destination`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({
        to: 'PortHarcourt',
      });
    expect(status).to.eql(401);
    expect(body.error).to.include('Unauthorized');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/destination Should allow parcel creator update parcel destination`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/destination`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        to: 'PortHarcourt',
      });
    expect(status).to.eql(200);
    expect(body.data.id).to.eql(parcelId);
    expect(body.data.to).to.eql('PortHarcourt');
    expect(body.data.message).to.eql('Parcel destination updated');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/status Should not allow non-admin change parcel status`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        status: 'transiting',
      });
    expect(status).to.eql(401);
    expect(body.error).to.include('Unauthorized');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/status Should allow only admins change parcel status`, async () => {
    const { body: userBody } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testAdmin);
    adminToken = userBody.data[0].token;
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'transiting',
      });
    expect(status).to.eql(200);
    expect(body.data.id).to.eql(parcelId);
    expect(body.data.status).to.eql('transiting');
    expect(body.data.message).to.eql('Parcel status updated');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/currentlocation Should not allow non-admin change parcel current location`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/currentlocation`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        currentlocation: 'ogun',
      });
    expect(status).to.eql(401);
    expect(body.error).to.include('Unauthorized');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/currentlocation Should allow only admins change parcel current location`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/currentlocation`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        currentlocation: 'ogun',
      });
    expect(status).to.eql(200);
    expect(body.data.id).to.eql(parcelId);
    expect(body.data.currentlocation).to.eql('ogun');
    expect(body.data.message).to.eql('Parcel location updated');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/delivered Should allow only admins mark parcel as delivered`, async () => {
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/delivered`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(status).to.eql(200);
    expect(body.data.id).to.eql(parcelId);
    expect(body.data.deliveredon).to.exist; // eslint-disable-line
    expect(body.data.message).to.eql('Parcel marked delivered');
  });

  it(`PATCH ${URL_PREFIX}parcels/:parcel/destination Should prevent changing parcel destination after it parcel has been delivered`, async () => {
    await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/delivered`)
      .set('Authorization', `Bearer ${adminToken}`);
    const { body, status } = await chaiReq.patch(`${URL_PREFIX}parcels/${parcelId}/destination`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        to: 'PortHarcourt',
      });
    expect(status).to.eql(403);
    expect(body.error).to.include('has already been delivered');
  });
});
