# BeyondToken
Beyond Token Implemetations

## Clone
'git clone https://github.com/likw99/BeyondToken.git'

## Install
### Blockchain tools
'cd BeyondToken/'

'npm install -g truffle'

'truffle --version' /**> refer to <https://truffleframework.com> */

'npm install -g ganache-cli'

'ganache-cli --version' /**> refer to <https://truffleframework.com> */

'npm install'

### Dapp tools
Chrome: <https://www.google.com/chrome/>

MetaMask extension: <https://metamask.io> /**> refer to <https://truffleframework.com/tutorials/pet-shop> */

## Compile
'rm -rf ./build'

'truffle compile'

## Test
'ganache-cli'

'truffle test'

## Deploy
'truffle migrate --network development'

'truffle migrate --network ropsten'

Contracts already deployed to Ropsten Network <https://ropsten.etherscan.io>

## Run
'npm run dev'

## Web DApp development
Demo DApp:

./src/index.html

./src/js/app.js

- Run with "npm run dev", the Demo DApp will be initialized with lite-server.
- Set up Chrome MetaMask Extension, make sure it's connected to etherum account on Ropsten Network.
- Open http://localhost:3000/ with Chrome
- Play the DApp

Main APIs:

App.createTimelock()

App.handleTransfer()

App.withdrawTokens()

refer to <https://github.com/trufflesuite/truffle/tree/next/packages/truffle-contract> for more detail.