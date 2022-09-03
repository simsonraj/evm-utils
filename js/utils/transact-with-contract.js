const Web3 = require('web3');
const ERC20TKN = require('../../contracts/Token.json');
const address = require('./addresses.json');
const ethers = require('ethers')
var Personal = require('web3-eth-personal')

const http_url = "http://localhost:8545"
const ws_url = "ws://localhost:8546"
const provider = new ethers.providers.JsonRpcProvider(http_url)
let owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

//this works with local hardhat instance, to use the code with testnet/mainet modify accordingly with respective private keys and unlock the account
const personal = new Personal(http_url)

const init = async () => {
  let web3 = new Web3(http_url);
  const networkId = await web3.eth.net.getId();
  console.log(networkId)
  var accounts = await web3.eth.getAccounts();
  console.log(accounts)
  var balance = await web3.eth.getBalance(accounts[2]);
  console.log(balance)
  var eth = await web3.utils.fromWei(balance);
  console.log(eth)

  const erc20TKN = await new web3.eth.Contract(
    ERC20TKN.abi,
    address.solidity.ERC20TKN,
    { from: owner }
  );

  erc20TKN.address = address.solidity.ERC20TKN

  //await personal.unlockAccount(owner, "", 60 * 60 * 12)
  //await personal.unlockAccount(accounts[3], "", 60 * 60 * 12)

  var sendtx = await web3.eth.sendTransaction({ to: accounts[0], from: accounts[3], value: 30000 });
  console.log(sendtx)

  try {
    var balance = await erc20TKN.methods.balanceOf(accounts[2]).call();
    await erc20TKN.methods.transfer(accounts[2], 100).send({ from: owner, gas: "4712388" });
  } catch (ex) {
    console.log(ex)
    let error = errorJson(ex)
    console.log("Transaction failed2, ", error.transactionHash);
    reason(error.transactionHash)
  }
}

init().then(async () => {
  console.log("Init done")
});


function errorJson(ex) {
  let lines = ex.toString().split('\n');
  lines.splice(0, 1);
  return JSON.parse(lines.join('\n'));
}

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

async function reason(hash) {
  console.log('tx hash:', hash)
  let tx = await provider.getTransaction(hash)
  if (!tx) {
    console.log('tx not found')
  } else {
    let code = await provider.call(tx, tx.blockNumber)
    console.log(code)
    let reason = hex_to_ascii(code.substr(138))
    console.log('revert reason:', reason)
  }
}
