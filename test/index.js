import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../lib/app';

chai.use(chaiHttp);

const chaiReq =  chai.request(server).keepOpen();
const { expect } = chai;

describe('APP', () => {
  it('Should Return a response', async () => {
    const { body } = await chaiReq.get('/')
    expect(body.message).to.equal('Something exists here');
  })
})