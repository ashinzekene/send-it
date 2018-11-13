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
}
const testParcel = {
  weight: '23',
  to: 'Lagos',
  from: 'Abuja',
}


const URL_PREFIX = '/api/v1/'
const chaiReq =  chai.request(server).keepOpen();
const expect = chai.expect;
let id = 1;

describe('PARCELS', () => {
  after(async() => {
    await chaiReq.post(`${URL_PREFIX}drop/parcels`).send();    
    await chaiReq.post(`${URL_PREFIX}drop/users`).send();    
  })

  it(`POST ${URL_PREFIX}parcels Should create a parcel`, async () => {
    const { body: userBody } = await chaiReq.post(`${URL_PREFIX}auth/signup`).send(testUser);
    const token = userBody.data[0].token;
    const { body, status } = await chaiReq.post(`${URL_PREFIX}parcels`)
    .set('Authorization', `Bearer ${token}`)    
    .send(testParcel);
    id = body.data[0].id;
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to');
  });
  
  it(`GET ${URL_PREFIX}parcels/:id Should get a single parcel by id`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}parcels/${id}`)
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to');
    expect(body.data[0]).to.have.property('from', testParcel.from);    
  });
  
  it(`GET ${URL_PREFIX}parcels Should get all parcels`, async () => {
    const { body, status } = await chaiReq.get(`${URL_PREFIX}parcels`)
    expect(status).to.equal(200);
    expect(body.data[0]).to.include.all.keys('weight', 'from', 'to', 'senton');
  });

})
