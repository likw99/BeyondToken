pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

import "zos-lib/contracts/Initializable.sol"; // upgradeable

contract BeyondToken is Initializable,
                        ERC20,
                        ERC20Detailed, 
                        ERC20Mintable,
                        ERC20Burnable,
                        ERC20Pausable,
                        ERC20Capped {
    /**
     * Variables
     */
    string public name = "Beyond Token";
    string public symbol = "BYD";
    uint8 public decimals = 18;
    string public version = "1.0";
    uint256 public maxCap = 10 * (10 ** 9); //10 billion * 10^18
    uint256 public initialSupply = 6 * (10 ** 9); //6 billion * 10^18

    /**
     * Constructor function
     */
    constructor()
        ERC20()
        ERC20Detailed(name, symbol, decimals)
        ERC20Mintable()
        ERC20Burnable()
        ERC20Pausable()
        ERC20Capped(maxCap)
        public
    {
        mint(msg.sender, initialSupply);
    }
}
