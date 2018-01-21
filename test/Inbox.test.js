const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');
const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;
const initialMessage = 'Hello World!';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: [initialMessage]})
    .send({from: accounts[0], gas: '1000000'});
  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address)
  });

  it('sets the initialMessage', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialMessage)
  });

  it('resets the message', async () => {
    await inbox.methods.setMessage('my new message').send({from: accounts[0], gas: '1000000'});
    const newMessage = await inbox.methods.message().call();
    assert.equal(newMessage, 'my new message')
  });
});