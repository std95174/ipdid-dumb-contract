pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract IpDid {

  event SetDid(address did, string didDoc);

  function setDid(address did, string memory didDoc) public {
    // did mapping to did document(msg.data)
    console.logAddress(did);
    console.log(didDoc);
    emit SetDid(msg.sender, didDoc);
  }
}
