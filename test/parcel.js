import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const testUser = {
  firstname: 'Ekene',
  lastname: 'Ekonash',
  othername: 'Eky',
  password: 'mypassword',
  email: 'ekonash2@gmail.com',
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

  it(`PATCH ${URL_PREFIX}parcels/:parcel/destination Should update parcel destination with parcel creator`, async () => {
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
});
