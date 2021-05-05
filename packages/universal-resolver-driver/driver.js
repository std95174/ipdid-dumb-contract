const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ethers } = require("ethers");
const bodyParser = require('koa-bodyparser');
require('dotenv').config()

const app = new Koa();
const router = new Router();

const provider = new ethers.providers.JsonRpcProvider(process.env.uniresolver_driver_did_tw_provider); // default: localhost:8545
const contractAddress = process.env.uniresolver_driver_did_tw_contract_address
const contractJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "IpDid.json"), "utf-8"))
const contractABI = contractJSON.abi;

router.get('/1.0/identifiers/:did', async (ctx, next) => {
    let did = ctx.params.did;
    if (did == "0xtestaddr") {
        ctx.body = {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld"
            ],
            "id": "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
            "verificationMethod": [
                {
                    "id": "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
                    "type": "EcdsaSecp256k1RecoveryMethod2020",
                    "controller": "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
                    "blockchainAccountId": "0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74@eip155:1"
                },
                {
                    "id": "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey",
                    "type": "EcdsaSecp256k1VerificationKey2019",
                    "controller": "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
                    "publicKeyHex": "0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479"
                }
            ],
            "authentication": [
                "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
                "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
            ],
            "assertionMethod": [
                "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
                "did:tw:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
            ]
        }
        return
    }
    try {
        if (did.split("did:tw:").length != 2) {
            did = `did:tw:${did}`;
        }

        console.log(did);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const didDocument = await contract.dids(did);
        try {
            if (typeof JSON.parse(didDocument) == "object") {
                ctx.body = JSON.parse(await contract.dids(did));
                return
            }
        } catch (e) {
            ctx.body = didDocument;
        }
    } catch (error) {
        ctx.body = { errMsg: error };
    }
});

router.post('/did', async (ctx, next) => {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const wallet = new ethers.Wallet(process.env.skale_private_key, provider)
        let contractWithSigner = contract.connect(wallet);

        let { did, didDocument } = ctx.request.body;
        // check format
        if (did.split("did:tw:").length != 2) {
            ctx.status = 400;
            ctx.body = {
                errMsg: "wrong did format"
            }
            return
        }
        let tx = await contractWithSigner.setDid(did, didDocument);
        const receipt = await tx.wait();
        ctx.body = { receipt: receipt }

    } catch (error) {
        console.log(error);
        ctx.body = { errMsg: error };
    }
})

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080);

console.log(`did resolver is listening on: http://localhost:8080 ...`);