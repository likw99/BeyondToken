pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/TokenTimeLock.sol";
import "./BeyondToken.sol";

/**
 * @title TokenTimelockFactory
 */
contract TokenTimelockFactory {

    // Token holders
    address[] private wallets;

    // Event
    event walletCreated(address wallet, address from, address to, uint256 createDate, uint256 unlockDate);

    function createTokenTimelock(
        address tokenContract, 
        address beneficiary, 
        uint256 releaseTime
        ) 
        public 
        returns(address wallet)
    {
        
        IERC20 token = IERC20(tokenContract);

        // Create new tokentimelock
        wallet = new TokenTimelock(token, beneficiary, releaseTime);

        // Push into list
        wallets.push(wallet);

        // Emit event
        emit walletCreated(address(wallet), msg.sender, beneficiary, now, releaseTime);

        // Return
        return address(wallet);
    }
}