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

/*-------------------------------SWAP PAGE-------------------------------------*/

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
  // console.log(
  //   "Token Bal->",
  //   web3.utils.fromWei(
  //     await token.methods.balanceOf(accounts[0]).call(),
  //     "ether"
  //   )
  // );
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
  // console.log("here1", a, routerContract.options.address);
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
    const reservesRaw = await pair.methods.getReserves();
    let results = [
      web3.utils.fromWei(String(reservesRaw[0]), "ether"),
      web3.utils.fromWei(String(reservesRaw[1]), "ether"),
    ];
    console.log("fetchReserves results->", results);
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
  const pairAddress = await factory.methods.pairs(token0Address, token1Address);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const reservesRaw = await fetchReserves(token0Address, token1Address, pair);
  // console.log("address in getRes->", accountAddress);
  // const liquidityTokens_BN = await pair.methods.balanceOf(accountAddress);
  // .call();
  // const liquidityTokens = web3.utils.fromWei(
  //   String(liquidityTokens_BN),
  //   "ether"
  // );
  // ).toFixed(2);
  // console.log(
  //   "getReserves LT->",
  // web3.utils.fromWei(String(liquidityTokens_BN), "ether")
  //   liquidityTokens_BN,
  //   accountAddress
  // );

  return [
    reservesRaw[0].toFixed(2),
    reservesRaw[1].toFixed(2),
    // liquidityTokens,
  ];
}

/*-------------------------------LIQUIDITY PAGE-------------------------------------*/

export async function quoteAddLiquidity(
  token0Address,
  token1Address,
  amountADesired,
  amountBDesired,
  factory
) {
  const pairAddress = await factory.getPair(token0Address, token1Address);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  const reservesRaw = await fetchReserves(token0Address, token1Address, pair); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  if (reserveA === 0 && reserveB === 0) {
    let amountOut = Math.sqrt(reserveA * reserveB);
    return [
      amountADesired.toString(),
      amountBDesired.toString(),
      amountOut.toString(),
    ];
  } else {
    let [amountBOptimal, amountOut] = quote(amountADesired, reserveA, reserveB);
    if (amountBOptimal <= amountBDesired) {
      return [
        amountADesired.toString(),
        amountBOptimal.toString(),
        amountOut.toString(),
      ];
    } else {
      let [amountAOptimal, amountOut] = quote(
        amountBDesired,
        reserveB,
        reserveA
      );
      console.log(amountAOptimal, amountOut);
      return [
        amountAOptimal.toString(),
        amountBDesired.toString(),
        amountOut.toString(),
      ];
    }
  }
}

const quote = (amount0, reserve0, reserve1) => {
  const amount1 = amount0 * (reserve1 / reserve0);
  const amountOut = Math.sqrt(amount1 * amount0);
  return [amount1, amountOut];
};

export async function quoteRemoveLiquidity(
  token0Address,
  token1Address,
  liquidity,
  factory
) {
  const pairAddress = await factory.getPair(token0Address, token1Address);
  console.log("pair address", pairAddress);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  const reservesRaw = await fetchReserves(token0Address, token1Address, pair); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  const _totalSupply = await pair.methods.totalSupply();
  let totalSupply = Number(web3.utils.fromWei(String(_totalSupply), "ether"));

  const Aout = (reserveA * liquidity) / totalSupply;
  const Bout = (reserveB * liquidity) / totalSupply;

  return [liquidity, Aout, Bout];
}

export async function addLiquidity(
  token0Address,
  token1Address,
  amount0,
  amount1,
  amount0min,
  amount1min,
  routerContract,
  account
) {
  const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  const token1 = new web3.eth.Contract(ERC20.abi, token1Address);

  // const token0Decimals = await getDecimals(token0);
  // const token1Decimals = await getDecimals(token1);

  // const amountIn0 = ethers.utils.parseUnits(String(amount0), token0Decimals);
  // const amountIn1 = ethers.utils.parseUnits(String(amount1), token1Decimals);
  const amountIn0 = web3.utils.toWei(String(amount0), "ether");
  const amountIn1 = web3.utils.toWei(String(amount1), "ether");

  // const amount0Min = ethers.utils.parseUnits(
  //   String(amount0min),
  //   token0Decimals
  // );
  // const amount1Min = ethers.utils.parseUnits(
  //   String(amount1min),
  //   token1Decimals
  // );
  const amount0Min = web3.utils.toWei(String(amount0min), "ether");
  const amount1Min = web3.utils.toWei(String(amount1min), "ether");

  await token0.methods.approve(routerContract.options.address, amountIn0);
  await token1.methods.approve(routerContract.options.address, amountIn1);

  // const wethAddress = await routerContract.WETH();

  console.log("addLiquidity->", [
    token0,
    token0Address,
    token1Address,
    amountIn0,
    amountIn1,
    amount0Min,
    amount1Min,
    account,
  ]);

  // Token + Token
  await routerContract.methods.addLiquidity(
    token0Address,
    token1Address,
    amountIn0,
    amountIn1,
    amount0Min,
    amount1Min,
    account
  );
  // }
}

// Function used to remove Liquidity from any pair of tokens or token-AUT
// To work correctly, there needs to be 9 arguments:
//    `address1` - An Ethereum address of the coin to recieve
//    `address2` - An Ethereum address of the coin to recieve
//    `liquidity_tokens` - A float or similar number representing the value of liquidity tokens you will burn to get tokens back
//    `amount1Min` - A float or similar number representing the minimum of address1's coin to recieve
//    `amount2Min` - A float or similar number representing the minimum of address2's coin to recieve
//    `routerContract` - The router contract to carry out this trade
//    `accountAddress` - An Ethereum address of the current user's account
//    `provider` - The current provider
export async function removeLiquidity(
  token0Address,
  token1Address,
  liquidity_tokens,
  amount0min,
  amount1min,
  routerContract,
  account,
  factory
) {
  const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  const token1 = new web3.eth.Contract(ERC20.abi, token1Address);

  const token0Decimals = await getDecimals(token0);
  const token1Decimals = await getDecimals(token1);

  const Getliquidity = (liquidity_tokens) => {
    if (liquidity_tokens < 0.001) {
      return ethers.BigNumber.from(liquidity_tokens * 10 ** 18);
    }
    return ethers.utils.parseUnits(String(liquidity_tokens), 18);
  };

  const liquidity = Getliquidity(liquidity_tokens);
  console.log("liquidity: ", liquidity);

  const amount0Min = ethers.utils.parseUnits(
    String(amount0min),
    token0Decimals
  );
  const amount1Min = ethers.utils.parseUnits(
    String(amount1min),
    token1Decimals
  );

  const pairAddress = await factory.getPair(token0Address, token1Address);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  await pair.methods.approve(routerContract.address, liquidity);

  console.log([
    token0Address,
    token1Address,
    Number(liquidity),
    Number(amount0Min),
    Number(amount1Min),
    account,
  ]);
  // Token + Token
  await routerContract.methods.removeLiquidity(
    token0Address,
    token1Address,
    liquidity,
    amount0Min,
    amount1Min,
    account
  );
  // }
}

export async function getDecimals(token) {
  const decimals = await token.methods
    .decimals()
    .call()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log("No tokenDecimals function for this token, set to 0");
      return 0;
    });
  return decimals;
}
