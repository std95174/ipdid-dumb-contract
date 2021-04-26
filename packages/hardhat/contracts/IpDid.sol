pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract IpDid {

  event SetDid(address did, string memory didDoc);
  
  mapping(address => string) public dids;

  function setDid(address did, string memory didDoc) public {
    // did mapping to did document(msg.data)
    console.logAddress(did);
    console.log(didDoc);
    dids[did] = didDoc;
    emit SetDid(msg.sender, didDoc);
  }
}
