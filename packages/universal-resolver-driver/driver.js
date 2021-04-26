const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ethers } = require("ethers");

const app = new Koa();
const router = new Router();

const provider = new ethers.providers.JsonRpcProvider(); // default: localhost:8545
const contractAddress = fs.readFileSync(path.join(__dirname, "..", "hardhat", "artifacts", "IpDid.address"), "utf-8")
const contractJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "hardhat", "artifacts", "contracts", "IpDid.sol", "IpDid.json"), "utf-8"))
const contractABI = contractJSON.abi;

router.get('/:did', async (ctx, next) => {
    try {
        const did = ctx.params.did;
        const contract = new ethers.Contract(contractAddress, contractABI, provider)
        ctx.body = { didDoc: JSON.parse(await contract.dids(did)) };
    } catch (error) {
        ctx.body = { errMsg: error };
    }

});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3001);

console.log(`did resolver is listening on: http://localhost:3001 ...`);