// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StableToken is ERC20, Ownable {

    constructor(string memory _tokenName, string memory _tokensymbol) ERC20(_tokenName, _tokensymbol) {}

    function mint(address recipient, uint256 amount) public onlyOwner {
        _mint(recipient, amount);
    }

    function burn(address account,uint amount) public onlyOwner {
        _burn(account,amount);
    }
}