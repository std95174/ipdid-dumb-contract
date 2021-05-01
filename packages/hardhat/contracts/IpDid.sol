pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract IpDid {

  event SetDid(address sender, string did, string didDoc);
  
  mapping(string => string) public dids;

  function setDid(string memory did, string memory didDoc) public {
    // did mapping to did document(msg.data)
    console.log(did);
    console.log(didDoc);
    dids[did] = didDoc;
    emit SetDid(msg.sender, did, didDoc);
  }
}
