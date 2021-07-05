const App = {
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    console.log(App.account);
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
