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
  const amountOut = await routerContract.methods
    .getAmountsOut(amountIn, path)
    .call();
  const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  console.log("swapTokens->", amountIn, amountOut, path, accountAddress);
  await token0.methods
    .approve(routerContract.options.address, amountIn)
    .send({ from: accountAddress });
  try {
    await routerContract.methods
      .swapExactTokensForTokens(amountIn, amountOut[1], path, accountAddress)
      .send({ from: accountAddress });
  } catch (err) {
    alert(err);
  }
}

export async function getAmountOut(
  token0Address,
  token1Address,
  amountIn,
  routerContract
) {
  try {
    const values_out = await routerContract.methods
      .getAmountsOut(web3.utils.toWei(String(amountIn), "ether"), [
        token0Address,
        token1Address,
      ])
      .call();
    const amount_out = Number(web3.utils.fromWei(values_out[1], "ether"));
    return amount_out;
  } catch {
    return false;
  }
}

export async function getPairs(factory) {
  try {
    const pairLength = await factory.methods.getAllPairsLength().call();
    let pairs = [];
    for (let i = 0; i < pairLength; i++) {
      const pair = await factory.methods.allPairs(i).call();
      pairs.push(pair);
    }
    return pairs;
  } catch (err) {
    console.log("No pairs found", err);
  }
}

export async function fetchReserves(token0Address, token1Address, pair) {
  try {
    const reservesRaw = await pair.methods.getReserves().call();
    // .then((reservesRaw) => {
    let results = [
      web3.utils.fromWei(String(reservesRaw[0]), "ether"),
      web3.utils.fromWei(String(reservesRaw[1]), "ether"),
    ];
    return [
      (await pair.methods.token0().call()) === token0Address
        ? results[0]
        : results[1],
      (await pair.methods.token1().call()) === token1Address
        ? results[1]
        : results[0],
    ];
    // })
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
  const pairAddress = await factory.methods
    .pairs(token0Address, token1Address)
    .call();
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const reservesRaw = await fetchReserves(token0Address, token1Address, pair);
  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    return [Number(reservesRaw[0]), Number(reservesRaw[1]), 0];
  } else {
    const liquidityTokens_BN = await pair.methods
      .balanceOf(accountAddress)
      .call();
    const liquidityTokens = web3.utils.fromWei(
      String(liquidityTokens_BN),
      "ether"
    );
    console.log("getReserves LT->", liquidityTokens);
    return [
      Number(reservesRaw[0]),
      Number(reservesRaw[1]),
      Number(liquidityTokens),
    ];
  }
}

/*-------------------------------LIQUIDITY PAGE-------------------------------------*/

export async function getDataForPairs(accountAddress, pairAddress) {
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const token0Address = await pair.methods.token0().call();
  const token1Address = await pair.methods.token1().call();
  const token0Symbol = await getBalanceandSymbol(accountAddress, token0Address);
  const token1Symbol = await getBalanceandSymbol(accountAddress, token1Address);
  const token0Bal = await getTokenBalance(token0Address);
  const token1Bal = await getTokenBalance(token1Address);
  return [
    token0Symbol.symbol,
    token1Symbol.symbol,
    token0Address,
    token1Address,
    token0Bal,
    token1Bal,
  ];
}

export async function quoteAddLiquidity(
  token0Address,
  token1Address,
  amountADesired,
  amountBDesired,
  factory
) {
  const pairAddress = await factory
    .getPair(token0Address, token1Address)
    .call();
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
  const pairAddress = await factory
    .getPair(token0Address, token1Address)
    .call();
  console.log("pair address", pairAddress);
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  const reservesRaw = await fetchReserves(token0Address, token1Address, pair); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  const _totalSupply = await pair.methods.totalSupply().call();
  let totalSupply = Number(web3.utils.fromWei(String(_totalSupply), "ether"));

  const Aout = (reserveA * liquidity) / totalSupply;
  const Bout = (reserveB * liquidity) / totalSupply;

  return [liquidity, Aout, Bout];
}

// const provider = new ethers.providers.Web3Provider(ethereum);

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

  const amountIn0 = web3.utils.toWei(String(amount0), "ether");
  const amountIn1 = web3.utils.toWei(String(amount1), "ether");

  const amount0Min = web3.utils.toWei(String(amount0min), "ether");
  const amount1Min = web3.utils.toWei(String(amount1min), "ether");

  await token0.methods
    .approve(routerContract.options.address, amountIn0)
    .send({ from: account });
  await token1.methods
    .approve(routerContract.options.address, amountIn1)
    .send({ from: account });

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
  try {
    await routerContract.methods
      .addLiquidity(
        token0Address,
        token1Address,
        amountIn0,
        amountIn1,
        amount0Min,
        amount1Min,
        account
      )
      .send({ from: account });
  } catch (err) {
    alert(err);
  }
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
  const liquidity = web3.utils.toWei(String(liquidity_tokens), "ether");

  const amount0Min = web3.utils.toWei(String(amount0min), "ether");
  const amount1Min = web3.utils.toWei(String(amount1min), "ether");

  console.log([
    token0Address,
    token1Address,
    liquidity,
    amount0Min,
    amount1Min,
    account,
  ]);
  const pairAddress = await factory.methods
    .pairs(token0Address, token1Address)
    .call();
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  await pair.methods
    .approve(routerContract.options.address, liquidity)
    .send({ from: account });

  // Token + Token
  await routerContract.methods
    .removeLiquidity(
      token0Address,
      token1Address,
      liquidity,
      amount0Min,
      amount1Min,
      account
    )
    .send({ from: account });
  // }
}
