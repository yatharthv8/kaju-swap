export default {};
// async onConnect() {
//   if (typeof window.ethereum !== "undefined") {
//     if (window.ethereum.isMetaMask) {
//       window.ethereum.request({ method: "eth_requestAccounts" });
//       console.log("The connected wallet is metamask");
//       const accounts = await web3.eth.getAccounts();
//       this.toggleConnectWalletButton();
//       console.log("All accounts", accounts);
//     } else {
//       alert(
//         "Wallets other than Metamask are not supported at the moment! sorry for the inconviniece caused."
//       );
//     }
//   } else {
//     console.log("Please install a Wallet Provider");
//     alert("Please install a Wallet Provider preferably Metamask.");
//   }
// },
// },
