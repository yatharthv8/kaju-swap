import { Contract, ethers } from "ethers";
import * as COINS from "./constants/coins.js";
import web3 from "../ethereum/web3.js";

const ROUTER = require("../ethereum/contracts/artifacts/KajuswapRouter.json");
const ERC20 = require("../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");
const FACTORY = require("../ethereum/contracts/artifacts/KajuswapFactory.json");
const PAIR = require("../ethereum/contracts/artifacts/KajuswapPair.json");
const { ethereum } = window;

export function getRouter(contractAddress) {
  return new web3.eth.Contract(ROUTER.abi, contractAddress);
}

export function getFactory(contractAddress) {
  return new web3.eth.Contract(FACTORY.abi, contractAddress);
}

export function getWeth(contractAddress) {
  return new web3.eth.Contract(ERC20.abi, contractAddress);
}

export async function getAccount() {
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}

//This function checks if a ERC20 token exists for a given address
// `address` - The Ethereum address to be checked
export function doesTokenExist(ethAddress) {
  try {
    return new web3.eth.Contract(ERC20.abi, ethAddress);
  } catch {
    return false;
  }
}

// This function returns an object with 2 fields: `balance` which container's the account's balance in the particular token,
// and `symbol` which is the abbreviation of the token name. To work correctly it must be provided with 2 arguments:
//    `accountAddress` - An Ethereum address of the current user's account
//    `address` - An Ethereum address of the token to check for (either a token or WETH)
export async function getBalanceandSymbol(accountAddress, address) {
  try {
    const token = new web3.eth.Contract(ERC20.abi, address);
    return {
      balance: web3.utils.fromWei(
        await web3.eth.getBalance(accountAddress),
        "ether"
      ),
      symbol: await token.methods.symbol().call(),
    };
  } catch (err) {
    console.log("The getBalanceAndSymbol function had an error!", err);
    return false;
  }
}

export async function getTokenBalance(address) {
  const token = new web3.eth.Contract(ERC20.abi, address);
  const accounts = await web3.eth.getAccounts();
  console.log(
    "Token Bal->",
    web3.utils.fromWei(
      await token.methods.balanceOf(accounts[0]).call(),
      "ether"
    )
  );
  return web3.utils.fromWei(
    await token.methods.balanceOf(accounts[0]).call(),
    "ether"
  );
}

//Swap function
export async function swapTokens(
  token0Address,
  token1Address,
  amount,
  routerContract,
  accountAddress
) {
  const path = [token0Address, token1Address];
  const amountIn = web3.utils.toWei(String(amount), "ether"); //amount should be int, return BN.js instance.
  const amountOut = await routerContract.methods.getAmountsOut(amountIn, path);
  const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  await token0.methods.approve(routerContract.options.address, amountIn);
  const a = await routerContract.methods.swapExactTokensForTokens(
    amountIn,
    amountOut.arguments[0],
    path,
    accountAddress
  );
  console.log("here1", a, routerContract.options.address);
}

export async function getAmountOut(
  token0Address,
  token1Address,
  amountIn,
  routerContract
) {
  // console.log(
  //   "Eth Func GAO->",
  //   typeof Number(
  //     web3.utils.fromWei(web3.utils.toWei(String(amountIn), "ether"), "ether")
  //   )
  // );
  // console.log("Y", amount_out);
  try {
    const values_out = await routerContract.methods.getAmountsOut(
      web3.utils.toWei(String(amountIn), "ether"),
      [token0Address, token1Address]
    );
    const amount_out = Number(
      web3.utils.fromWei(values_out.arguments[0], "ether")
    );
    return amount_out;
  } catch {
    return false;
  }
}

export async function fetchReserves(token0Address, token1Address, pair) {
  try {
    const reservesRaw = await pair.getReserves();
    let results = [
      web3.utils.fromWei(reservesRaw[0], "ether"),
      web3.utils.fromWei(reservesRaw[1], "ether"),
    ];
    return [
      (await pair.token0()) === token0Address ? results[0] : results[1],
      (await pair.token1()) === token1Address ? results[1] : results[0],
    ];
  } catch (err) {
    console.log("No reserves found!");
    return [0, 0];
  }
}

export async function getReserves(
  token0Address,
  token1Address,
  factory,
  accountAddress
) {
  const pairAddress = await factory.pairs(token0Address, token1Address);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const reservesRaw = await fetchReserves(token0Address, token1Address, pair);
  const liquidityTokens_BN = await pair.balanceOf(accountAddress);
  const liquidityTokens = Number(
    web3.utils.fromWei(liquidityTokens_BN, "ether")
  ).toFixed(2);

  return [
    reservesRaw[0].toFixed(2),
    reservesRaw[1].toFixed(2),
    liquidityTokens,
  ];
}
