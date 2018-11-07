App = {
  web3Provider: null,
  contracts: {}, 
  instances: {}, // contract instances
  tokentimelocks: [],
  // Developer flag: true(local network), false(ropsten network)
  dev: false,
  // Ropsten
  factoryAddress: "0x0c90186e153886c8cbec1a4bf00c4acd67384364",
  tokenAddress: "0x24033c7261c1c3f6366c61317c88a03994ba53d4",

  getFactoryContract: function() {
    if (App.dev)
        return App.contracts.factory.deployed();
    else
        return App.contracts.factory.at(App.factoryAddress);
  },

  getTokenContract: function(){
    if (App.dev)
        return App.contracts.token.deployed();
    else
        return App.contracts.token.at(App.tokenAddress);
  },

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('BeyondToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var tokenArtifact = data;
      App.contracts.token = TruffleContract(tokenArtifact);
      // Set the provider for our contract.
      App.contracts.token.setProvider(App.web3Provider);
      console.log('Token contract initialized.');

      $.getJSON('TokenTimelockFactory.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var factoryArtifact = data;
        App.contracts.factory = TruffleContract(factoryArtifact);
        // Set the provider for our contract.
        App.contracts.factory.setProvider(App.web3Provider);
        console.log('Factory contract initialized.');

        $.getJSON('TokenTimelock.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract.
          var timelockArtifact = data;
          App.contracts.timelock = TruffleContract(timelockArtifact);
          // Set the provider for our contract.
          App.contracts.timelock.setProvider(App.web3Provider);
          console.log('Timelock contract initialized.');

          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.error(error);
            } else {
              // init
              App.getTokenContract().then(function(instance) {
                App.instances.token = instance;
                $('#tokenAddress').text(App.instances.token.address);
              });
              App.getFactoryContract().then(function(instance) {
                App.instances.factory = instance;
                $('#factoryAddress').text(App.instances.factory.address);
              });
            }
          });
        });
      });
      // Get balances of current account.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#createTokentimelockButton', App.createTimelock);
    $(document).on('click', '#withdrawButton', App.withdrawTokens);
  },

  createTimelock: function() {
    var tokenAddress = App.instances.token.address; // TODO: change hardcode
    var beneficiary = $('#TKTBeneficiary').val();
    var releaseTime = new Date($('#TKTreleaseTime').val()).getTime() / 1000; //in seconds

    console.log(tokenAddress);
    console.log(beneficiary);
    console.log(releaseTime);

    App.getFactoryContract().then(function(instance) {
      factoryInstance = instance;
      console.log(factoryInstance.address);
      return factoryInstance.createTokenTimelock(tokenAddress, beneficiary, releaseTime);
    }).then(function(result) {
      eventlog = result.logs[0];
      tokentimelock = eventlog.args.wallet;
      console.log(tokentimelock);
      App.tokentimelocks.push(tokentimelock); // TODO
      $('#tokenTimelockAddress').text(tokentimelock);
      $('#tokenTimelockReleaseTime').text($('#TKTreleaseTime').val());
      alert('tokentimelock created at' + tokentimelock);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  withdrawTokens: function() {
    var withdrawAddress = $('#withdrawAddress').val();
    console.log(withdrawAddress);
    App.contracts.timelock.at(withdrawAddress).then(async function(instance) {
      timelockInstance = instance;

      token = await timelockInstance.token();
      beneficiary = await timelockInstance.beneficiary();
      releaseTime = await timelockInstance.releaseTime();

      $('#BeneficiaryAddress').text(beneficiary);

      console.log('token: '+ token);
      console.log('beneficiary: ' + beneficiary);
      console.log('releaseTime: ' + releaseTime);
      
      console.log('Now: ' + Date.now()/1000);
      if(Date.now()/1000 > releaseTime) {
        timelockInstance.release();
      } else {
        alert('still within lock time, try to withdraw later.');
      }
    }).catch(function(err) {
      alert(err.message);
      console.log(err.message);
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var TokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.getTokenContract().then(function(instance) {
        TokenInstance = instance;
        return TokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var TokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.getTokenContract().then(function(instance) {
        TokenInstance = instance;
        return TokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        $('#TTAddress').text(account);
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
