const Web3 = require('web3');
const address = require('./addresses.json');

let web3Provider = new Web3.providers.WebsocketProvider("ws://localhost:8545");
var web3Obj = new Web3(web3Provider);
//Emit event from smart contract with method
//Solidity: event Debug(string message);

const methodSignature = 'Debug(string)'
async function init() {
  var tx = await web3Obj.eth.getBlock("latest")
  console.log(web3Obj.utils.keccak256(methodSignature))
}

init()

var logsSubscription = web3Obj.eth.subscribe('logs', {
  address: address.solidity.Contract, //Smart contract address //change this
  fromBlock: 1,
  topics: [web3Obj.utils.keccak256(methodSignature)] //topics for events //change this
}, function (error, result) {
  if (error) console.log(error);
  console.log("inside")
}).on("data", function (trxData) {
  console.log("Event received", trxData);
  //Code from here would be run immediately when event appeared
  for (const topic of trxData.topics) {
    if (topic == web3Obj.utils.keccak256(methodSignature)) {
      const result = web3Obj.eth.abi.decodeLog(
        debugEventInputABI,
        trxData.data,
        trxData.topics
      );
      console.log("Decoded debug data: ", result);
    }
  }
});

debugEventInputABI = [
  {
    "indexed": false,
    "internalType": "string",
    "name": "message",
    "type": "string"
  }
]