const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ethers } = require("ethers");
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
require('dotenv').config()
const createClient = require('ipfs-http-client')

const app = new Koa();
const router = new Router();

const provider = new ethers.providers.JsonRpcProvider(process.env.uniresolver_driver_did_tw_provider); // default: localhost:8545
const contractAddress = process.env.uniresolver_driver_did_tw_contract_address
const contractJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "IpDid.json"), "utf-8"))
const contractABI = contractJSON.abi;

const testDidDocument = {
    '@context': [
        "https://www.w3.org/ns/did/v1",
        "https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld"
    ],
    id: "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
    verificationMethod: [
        {
            id: "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
            type: "EcdsaSecp256k1RecoveryMethod2020",
            controller: "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
            blockchainAccountId: "0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74@eip155:1"
        },
        {
            id: "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey",
            type: "EcdsaSecp256k1VerificationKey2019",
            controller: "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
            publicKeyHex: "0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479"
        }
    ],
    authentication: [
        "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
        "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
    ],
    assertionMethod: [
        "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
        "did:ipdid:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
    ]
}

const testDidResolutionMetadata = {
    duration: 1417,
    identifier: "did:ipdid:0xtestaddr",
    pattern: "^(did:ipdid:.+)$",
    driverUrl: "http://bba-did-driver:8080/1.0/identifiers/",
    didUrl: {
        didUrlString: "did:ipdid:0xtestaddr",
        did: {
            didString: "did:ipdid:0xtestaddr",
            method: "bba",
            methodSpecificId: "0xtestaddr",
            parseTree: null,
            parseRuleCount: null
        },
        path: "",
        query: null,
        fragment: null,
        parameters: {},
        parseTree: null,
        parseRuleCount: null
    }
}

const testDidDocumentMetadata = {}

router.get('/1.0/identifiers/:did', async (ctx, next) => {
    let did = ctx.params.did;
    if (did == "0xtestaddr" || did == "did:ipdid:0xtestaddr") {
        ctx.body = {
            didDocument: testDidDocument,
            didResolutionMetadata: testDidResolutionMetadata,
            didDocumentMetadata: testDidDocumentMetadata
        }
        return
    }
    try {
        console.log(did);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const cid = await contract.dids(did);
        console.log(`cid: ${cid}`);
        if (cid.length == 0) {
            ctx.status = 404;
            ctx.body = {
                did: did,
                status: { error: "no CID found" }
            };
            return
        }

        // get did document from ipfs
        try {
            // const client = createClient('https://ipfs.infura.io:5001')
            // const result = await client.cat(cid);
            const result = await axios.default.get(`https://ipfs.infura.io:5001/api/v0/block/get?arg=${cid}`);
            console.log(result.data);

            // let didDocument;
            // for await (const item of result) {
            //     didDocument = (item.toString());
            // }

            ctx.body = {
                did: did,
                cid: cid,
                didDocument: (result.data),
                didResolutionMetadata: testDidResolutionMetadata,
                didDocumentMetadata: testDidDocumentMetadata
            };
        } catch (error) {
            ctx.body = {
                did: did,
                cid: cid,
                status: { error: "no DID Document found" }
            };
        }

    } catch (error) {
        ctx.body = { error: error };
    }
});

router.post('/did', async (ctx, next) => {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const wallet = new ethers.Wallet(process.env.skale_private_key, provider)
        let contractWithSigner = contract.connect(wallet);

        let { did, cid } = ctx.request.body;

        let tx = await contractWithSigner.setDid(did, cid);
        const receipt = await tx.wait();
        ctx.body = { receipt: receipt }

    } catch (error) {
        console.log(error);
        ctx.body = { errMsg: error };
    }
})

// for test
router.post('/ipfs', async (ctx, next) => {
    const data = testDidDocument;

    // connect to a different API
    const client = createClient('https://ipfs.infura.io:5001')
    // call Core API methods
    const doc = JSON.stringify(testDidDocument);
    const { cid } = await client.add(doc);
    console.log(cid);
    ctx.body = {
        cid: cid
    }
})

app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080);

console.log(`did resolver is listening on: http://localhost:8080 ...`);