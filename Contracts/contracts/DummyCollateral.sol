pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DummyCollateral is ERC20, Ownable {

    constructor(string memory _tokenName, string memory _tokensymbol) ERC20(_tokenName, _tokensymbol) {}

    function mint(address recipient, uint256 amount) public {
        _mint(recipient, amount);
    }

    function burn(address account,uint amount) public  {
        _burn(account,amount);
    }
}