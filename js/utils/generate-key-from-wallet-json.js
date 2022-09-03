var keythereum = require("keythereum");

var datadir = "../";
var address = "eth_address_from_ks_file";//change this
const password = "FILE_PASSWORD";//change this
var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));
