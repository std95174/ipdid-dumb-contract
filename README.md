# 🏗 scaffold-eth

---

# 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/std95174/ipdid-dumb-contract.git

cd ipdid-dumb-contract
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd ipdid-dumb-contract
yarn chain

```

> in a third terminal window:

```bash
cd ipdid-dumb-contract
yarn deploy


```

部署在SKALE Chain

```bash
cp /packages/hardhat/.env.example /packages/hardhat/.env
# change your test private key to /packages/hardhat/.env
yarn deploy --network skale
```

* 複製合約地址檔案`/packages/hardhat/artifacts/IpDid.address`的內容到`/packages/universal-resolver-driver/universal-resolver/.env`的`uniresolver_driver_did_tw_contract_address`中
* 複製合約ABI

  `cp /packages/hardhat/artifacts/contracts/IpDid.sol/IpDid.json /packages/universal-resolver-driver/IpDid.json`

> in a fourth terminal window (resolver):

* 修改 `/packages/universal-resolver-driver/universal-resolver/.env`的`uniresolver_driver_did_tw_provider`
  * 使用docker: http://host.docker.internal:8545
  * 不使用docker: http://localhost:8545
  * 使用其他節點: http://{nodeIp}:{nodePort}
  * SKALE Chain: https://dev-testnet-v1-1.skalelabs.com

```bash
# Build uni-resolver-web locally:
docker build -f ./uni-resolver-web/docker/Dockerfile . -t universalresolver/uni-resolver-web

cd /packages/universal-resolver-driver/universal-resolver
docker-compose build
docker-compose up -d

```

# Test Steps

  1. 開啟 <http://localhost:3000>
  2. setDid, i.e., `did:tw:0xe371c5123e0131AbBbC7BA60c27896049C6cb892`

  ```json
    {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld"
      ],
      "id": "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
      "verificationMethod": [
        {
          "id": "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
          "blockchainAccountId": "0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74@eip155:1"
        },
        {
          "id": "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey",
          "type": "EcdsaSecp256k1VerificationKey2019",
          "controller": "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479",
          "publicKeyHex": "0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479"
        }
      ],
      "authentication": [
        "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
        "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
      ],
      "assertionMethod": [
        "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller",
        "did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey"
      ]
    }
  ```

  3. 開啟 <http://localhost:8080/1.0/identifiers/did:tw:{address}>，將`address`換成要查詢的值。即可得到`did document`。

## Set DID

Add your skale private key to `/packages/universal-resolver-driver/universal-resolver/.env`

Post data to API like:


  ```sh
  didDocument=$(cat   << EOF
  "{\n      \"@context\": [\n        \"https://www.w3.org/ns/did/v1\",\n        \"https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld\"\n      ],\n      \"id\": \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479\",\n      \"verificationMethod\": [\n        {\n          \"id\": \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller\",\n          \"type\": \"EcdsaSecp256k1RecoveryMethod2020\",\n          \"controller\": \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479\",\n          \"blockchainAccountId\": \"0xF3beAC30C498D9E26865F34fCAa57dBB935b0D74@eip155:1\"\n        },\n        {\n          \"id\": \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey\",\n          \"type\": \"EcdsaSecp256k1VerificationKey2019\",\n          \"controller\": \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479\",\n          \"publicKeyHex\": \"0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479\"\n        }\n      ],\n      \"authentication\": [\n        \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller\",\n        \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey\"\n      ],\n      \"assertionMethod\": [\n        \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controller\",\n        \"did:ethr:0x03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479#controllerKey\"\n      ]\n    }"
EOF
)  
  curl --location --request POST 'http://localhost:8120/did' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "did": "did:tw:testDid",
    "didDocument": '$didDocument'
  }'
  ```

## Call API on Vercel
  
1. Send data to IPFS, get cid
2. Write did and cid to contract
  
  ```sh
  curl --location --request POST 'http://universal-resolver-driver-frankwang95174.vercel.app/did' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "did": "did:ipdid:frank",
      "cid": "QmVE6LFaMLJAFmnC9QX1k4eis1k4aBg5YZzBSFKormLVB5"
  }'
  ```

3. get data from did by resolver

  ```sh
  curl --location --request GET 'https://universal-resolver-driver-frankwang95174.vercel.app/1.0/identifiers/did:ipdid:frank'
  ```
