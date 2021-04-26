const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ethers } = require("ethers");

const app = new Koa();

const provider = new ethers.providers.JsonRpcProvider(); // default: localhost:8545
const contractAddress = fs.readFileSync(path.join(__dirname, "..", "hardhat", "artifacts", "IpDid.address"), "utf-8")
const contractJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "hardhat", "artifacts", "contracts", "IpDid.sol", "IpDid.json"), "utf-8"))
const contractABI = contractJSON.abi;

// response
app.use(async ctx => {
    const did = "0xe371c5123e0131AbBbC7BA60c27896049C6cb892";
    const contract = new ethers.Contract(contractAddress, contractABI, provider)

    ctx.body = JSON.parse(await contract.dids(did));
});

app.listen(3001);