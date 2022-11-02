import web3 from "../ethereum/web3.js";
// import detectEthereumProvider from "@metamask/detect-provider";

import { ethers } from "ethers";
import swal from "sweetalert";

const ROUTER = require("../ethereum/contracts/artifacts/KajuswapRouter.json");
const ERC20 = require("../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");
const FACTORY = require("../ethereum/contracts/artifacts/KajuswapFactory.json");
const PAIR = require("../ethereum/contracts/artifacts/KajuswapPair.json");
const WETH = require("../ethereum/contracts/artifacts/IWETH.json");
const { ethereum } = window;

export function getRouter(contractAddress) {
  return new web3.eth.Contract(ROUTER.abi, contractAddress);
}

export function getFactory(contractAddress) {
  return new web3.eth.Contract(FACTORY.abi, contractAddress);
}

export function getWeth(contractAddress) {
  return new web3.eth.Contract(WETH.abi, contractAddress);
}

export async function getAccount() {
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}

export function bfs(graph, start) {
  let queue = {};
  let dist = {};
  let q = [];
  q.push(start);
  queue[start] = [];
  queue[start].push(-1);
  dist[start] = 0;
  while (q.length > 0) {
    let u = q.shift();
    // console.log(graph[u]);
    graph[u].forEach((v) => {
      if (dist[v] === undefined || dist[v] > dist[u] + 1) {
        dist[v] = dist[u] + 1;
        q.push(v);
        queue[v] = [];
        queue[v].push(u);
      } else if (dist[v] === dist[u] + 1) {
        queue[v].push(u);
      }
    });
  }
  return queue;
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
export async function getBalanceandSymbol(accountAddress, address, mark) {
  try {
    if (address === process.env.VUE_APP_WETH && mark) {
      return {
        balance: parseFloat(
          web3.utils.fromWei(await web3.eth.getBalance(accountAddress), "ether")
        ).toFixed(4),
        symbol: "ETH",
      };
    }
    const accounts = await web3.eth.getAccounts();
    const token = new web3.eth.Contract(ERC20.abi, address);
    return {
      balance: parseFloat(
        web3.utils.fromWei(
          await token.methods.balanceOf(accounts[0]).call(),
          "ether"
        )
      ).toFixed(4),
      symbol: await token.methods.symbol().call(),
      name: await token.methods.name().call(),
    };
  } catch (err) {
    swal("Error", "Enter a valid token address", "error");
    console.log("The getBalanceAndSymbol function had an error!", err);
    return false;
  }
}

export async function getTokenBalance(address, accountAddress, mark) {
  if (address === process.env.VUE_APP_WETH && mark) {
    return parseFloat(
      web3.utils.fromWei(await web3.eth.getBalance(accountAddress), "ether")
    ).toFixed(4);
  }
  const token = new web3.eth.Contract(ERC20.abi, address);
  const accounts = await web3.eth.getAccounts();
  return parseFloat(
    web3.utils.fromWei(
      await token.methods.balanceOf(accounts[0]).call(),
      "ether"
    )
  ).toFixed(4);
}

//Swap function
export async function swapTokens(
  path,
  amount,
  routerContract,
  accountAddress,
  slippageVal,
  deadline,
  mark
) {
  const time = ethers.BigNumber.from(
    Math.floor(Date.now() / 1000) + deadline * 60
  );
  let amountIn;
  if (amount > 0.001) {
    amountIn = web3.utils.toWei(String(amount), "ether");
  } else {
    amountIn = toWei(amount);
  } //amount should be int, return BN.js instance.
  const amountOut = await routerContract.methods
    .getAmountsOut(amountIn, path)
    .call();
  const amountOutMin = slippageCalc(
    slippageVal,
    amountOut[amountOut.length - 1]
  );
  // const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  console.log(
    "swapTokens->",
    amountIn,
    amountOutMin,
    amountOut,
    path,
    accountAddress,
    time
  );
  try {
    if (path[0] === process.env.VUE_APP_WETH && mark) {
      await routerContract.methods
        .swapExactETHForTokens(amountOutMin, path, accountAddress, time)
        .send({ from: accountAddress, value: amountIn });
    } else if (path[path.length - 1] === process.env.VUE_APP_WETH && mark) {
      await routerContract.methods
        .swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          accountAddress,
          time
        )
        .send({ from: accountAddress });
    } else {
      await routerContract.methods
        .swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          accountAddress,
          time
        )
        .send({ from: accountAddress });
    }
    swal("Success!!", "Transaction was completed successfully", "success");
  } catch (err) {
    swal("Oops!", "Something Happened! Transaction was not completed", "error");
  }
}

export async function getAmountOut(path, amountIn, routerContract) {
  try {
    const values_out = await routerContract.methods
      .getAmountsOut(web3.utils.toWei(String(amountIn), "ether"), path)
      .call();
    // console.log(values_out, path);
    const amount_out = Number(
      web3.utils.fromWei(values_out[values_out.length - 1], "ether")
    );
    return amount_out;
  } catch {
    return false;
  }
}

export async function getAmountIn(path, amountOut, routerContract) {
  try {
    const values_in = await routerContract.methods
      .getAmountsIn(web3.utils.toWei(String(amountOut), "ether"), path)
      .call();
    // console.log(values_in);
    const amount_in = Number(web3.utils.fromWei(values_in[0], "ether"));
    return amount_in;
  } catch {
    swal(
      "Alert",
      `You have entered values greater than reserves. Please see the values of corresponding reserves at the bottom of the screen and then enter values accordingly!`,
      "warning"
    );
    return false;
  }
}

export async function getPairs(factory, accountAddress) {
  try {
    const pairLength = await factory.methods.allPairsLength().call();
    let pairs = [];
    let allPairsForGraph = [];
    for (let i = 0; i < pairLength; i++) {
      const pair = await factory.methods.allPairs(i).call();
      allPairsForGraph.push(pair);
      if (await CGIfLiquidityExists(pair, accountAddress, "check")) {
        pairs.push(pair);
      }
    }
    // if (graph === 1) {
    //   return allPairsForGraph;
    // }
    // for (let i = 0; i < pairLength; ++i) {
    //   console.log(checkIfLiquidityExists(pairs[i], accountAddress));
    // }
    return [pairs, allPairsForGraph];
  } catch (err) {
    console.log("No pairs found --->>", err);
  }
}

const CGIfLiquidityExists = async (pairAddress, accountAddress, command) => {
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const liquidityTokens_BN = await pair.methods
    .balanceOf(accountAddress)
    .call();
  // const liquidityTokens = web3.utils.fromWei(
  //   String(liquidityTokens_BN),
  //   "ether"
  // );
  // console.log("getReserves LT->", liquidityTokens_BN);
  if (command === "check") {
    if (liquidityTokens_BN > 0) {
      return true;
    }
    return false;
  } else {
    return Number(
      web3.utils.fromWei(String(liquidityTokens_BN), "ether")
    ).toFixed(5);
  }
};

export async function fetchReserves(token0Address, token1Address, pair) {
  try {
    const reservesRaw = await pair.methods.getReserves().call();
    // .then((reservesRaw) => {
    let results = [
      web3.utils.fromWei(String(reservesRaw[0]), "ether"),
      web3.utils.fromWei(String(reservesRaw[1]), "ether"),
    ];
    // console.log(reservesRaw, token0Address);
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
    // swal("No direct pair exists between these two tokens!!");
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
    .getPair(token0Address, token1Address)
    .call();
  let LiqExists = false;
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const reservesRaw = await fetchReserves(token0Address, token1Address, pair);
  // console.log(reservesRaw);
  if (pairAddress === "0x0000000000000000000000000000000000000000") {
    return [Number(reservesRaw[0]), Number(reservesRaw[1]), 0, 0, 0, 0, false];
  } else {
    LiqExists = true;
    const liquidityTokens_BN = await pair.methods
      .balanceOf(accountAddress)
      .call();
    const liquidityTokens = web3.utils.fromWei(
      String(liquidityTokens_BN),
      "ether"
    );
    const totalSuplyOfLiquidity = web3.utils.fromWei(
      String(await pair.methods.totalSupply().call()),
      "ether"
    );
    let liquidityTokensPercentage = (
      (liquidityTokens / totalSuplyOfLiquidity) *
      100
    ).toFixed(4);
    if (Number(liquidityTokens) < 1e-12) {
      liquidityTokensPercentage = 0;
    }
    // console.log("getReserves LT->", liquidityTokens);
    return [
      Number(reservesRaw[0]),
      Number(reservesRaw[1]),
      Number(liquidityTokens) - 0.00000000000001,
      Number(liquidityTokensPercentage),
      Number(totalSuplyOfLiquidity),
      LiqExists,
      true,
    ];
  }
}

/*-------------------------------LIQUIDITY PAGE-------------------------------------*/

export async function getDataForPairs(accountAddress, pairAddress, mark) {
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const token0Address = await pair.methods.token0().call();
  const token1Address = await pair.methods.token1().call();
  const token0Symbol = await getBalanceandSymbol(
    accountAddress,
    token0Address,
    mark
  );
  const token1Symbol = await getBalanceandSymbol(
    accountAddress,
    token1Address,
    mark
  );
  const token0Bal = await getTokenBalance(token0Address, accountAddress, mark);
  const token1Bal = await getTokenBalance(token1Address, accountAddress, mark);
  const liqTokens = await CGIfLiquidityExists(
    pairAddress,
    accountAddress,
    "get"
  );
  return [
    token0Symbol.symbol,
    token1Symbol.symbol,
    token0Address,
    token1Address,
    token0Bal,
    token1Bal,
    liqTokens,
  ];
}

export async function quoteAddLiquidity(
  token0Address,
  token1Address,
  amountADesired,
  amountBDesired,
  factory,
  inpBox
) {
  const pairAddress = await factory.methods
    .getPair(token0Address, token1Address)
    .call();
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  const reservesRaw = await fetchReserves(token0Address, token1Address, pair); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  // console.log(amountADesired, amountBDesired);
  if (reserveA === 0 && reserveB === 0) {
    let amountOut = Math.sqrt(reserveA * reserveB);
    // console.log("here-1", amountOut);
    return [String(amountADesired), String(amountBDesired), String(amountOut)];
  } else if (inpBox === 0) {
    {
      let [amountBOptimal, amountOut] = quote(
        amountADesired,
        reserveA,
        reserveB
      );
      // console.log("here-20", amountBOptimal, amountBDesired, amountOut);
      if (amountBOptimal <= amountBDesired) {
        return [
          String(amountADesired),
          String(amountBOptimal),
          String(amountOut),
        ];
      } else {
        let [amountAOptimal, amountOut] = quote(
          amountBDesired,
          reserveB,
          reserveA
        );
        // console.log("here-3", amountOut);
        // console.log("here-3", amountAOptimal, amountOut);
        return [
          String(amountAOptimal),
          String(amountBDesired),
          String(amountOut),
        ];
      }
    }
  } else {
    let [amountAOptimal, amountOut] = quote(amountBDesired, reserveB, reserveA);
    // console.log("here-21", amountAOptimal, amountADesired, amountOut);
    if (amountAOptimal <= amountADesired) {
      return [
        String(amountAOptimal),
        String(amountBDesired),
        String(amountOut),
      ];
    } else {
      let [amountBOptimal, amountOut] = quote(
        amountADesired,
        reserveA,
        reserveB
      );
      return [
        String(amountADesired),
        String(amountBOptimal),
        String(amountOut),
      ];
    }
  }
}

const quote = (amount0, reserve0, reserve1) => {
  const amount1 = amount0 * (reserve1 / reserve0);
  const amountOut = Math.sqrt(amount1 * amount0);
  return [amount1, amountOut];
};

const slippageCalc = (slippageVal, amount) => {
  amount = String(amount * (1 - slippageVal / 100));
  // console.log("It has", amount);
  let decimalPoint = amount * 10;
  // console.log("It has", amount);
  decimalPoint = amount % 10;
  // console.log("It has decimals", decimalPoint);
  if (decimalPoint != 0) {
    const pos = amount.split(".");
    amount = pos[0];
  }
  // console.log(amount);
  return amount;
};

const toWei = (number) => {
  let amount = String(number * 1000000000000000000);
  let decimalPoint = amount * 10;
  decimalPoint = amount % 10;
  if (decimalPoint != 0) {
    const pos = amount.split(".");
    amount = pos[0];
  }
  return amount;
};

export async function quoteRemoveLiquidity(
  token0Address,
  token1Address,
  liquidity,
  factory
) {
  const pairAddress = await factory.methods
    .getPair(token0Address, token1Address)
    .call();
  // console.log("pair address", pairAddress);
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
  slippageVal,
  routerContract,
  account,
  deadline
) {
  // const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  // const token1 = new web3.eth.Contract(ERC20.abi, token1Address);

  let amountIn0;
  let amountIn1;
  if (amountIn0 > 0.001) {
    amountIn0 = web3.utils.toWei(String(amount0), "ether");
  } else {
    amountIn0 = toWei(amount0);
  }
  if (amountIn1 > 0.001) {
    amountIn1 = web3.utils.toWei(String(amount1), "ether");
  } else {
    amountIn1 = toWei(amount1);
  }
  const time = ethers.BigNumber.from(
    Math.floor(Date.now() / 1000) + deadline * 60
  );
  // let amount0Min = web3.utils.toWei(String(amount0), "ether");
  // let amount1Min = web3.utils.toWei(String((amount0 * (100 - slippageVal) / 100)), "ether");

  const amount0Min = slippageCalc(slippageVal, amountIn0);
  const amount1Min = slippageCalc(slippageVal, amountIn1);

  // await token0.methods
  //   .approve(routerContract.options.address, amountIn0)
  //   .send({ from: account });
  // await token1.methods
  //   .approve(routerContract.options.address, amountIn1)
  //   .send({ from: account });

  console.log("addLiquidity->", [
    // token0,
    token0Address,
    token1Address,
    amountIn0,
    amountIn1,
    amount0Min,
    amount1Min,
    account,
    time,
  ]);

  // Token + Token
  try {
    if (token0Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .addLiquidityETH(
          token1Address,
          amountIn1,
          amount1Min,
          amount0Min,
          account,
          time
        )
        .send({ from: account, value: amountIn0 });
    } else if (token1Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .addLiquidityETH(
          token0Address,
          amountIn0,
          amount0Min,
          amount1Min,
          account,
          time
        )
        .send({ from: account, value: amountIn1 });
    } else {
      await routerContract.methods
        .addLiquidity(
          token0Address,
          token1Address,
          amountIn0,
          amountIn1,
          amount0Min,
          amount1Min,
          account,
          time
        )
        .send({ from: account });
    }
    swal("Hurray!!", "Transaction Completed Successfully!", "success");
    return true;
  } catch (err) {
    swal("Oops!", "Transaction was Unsuccessful!", "error");
    return false;
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
  deadline
) {
  const liquidity = web3.utils.toWei(String(liquidity_tokens), "ether");

  let amount0Min;
  if (amount0min > 0.001) {
    amount0Min = web3.utils.toWei(String(amount0min), "ether");
  } else {
    amount0Min = toWei(amount0min);
  }
  let amount1Min;
  if (amount1min > 0.001) {
    amount1Min = web3.utils.toWei(String(amount1min), "ether");
  } else {
    amount1Min = toWei(amount1min);
  }
  const time = ethers.BigNumber.from(
    Math.floor(Date.now() / 1000) + deadline * 60
  );

  console.log([
    token0Address,
    token1Address,
    liquidity,
    amount0Min,
    amount1Min,
    account,
    time,
  ]);
  // const pairAddress = await factory.methods
  //   .pairs(token0Address, token1Address)
  //   .call();
  // const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  // await pair.methods
  //   .approve(routerContract.options.address, liquidity)
  //   .send({ from: account });

  // Token + Token
  try {
    if (token0Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .removeLiquidityETH(
          token1Address,
          liquidity,
          amount1Min,
          amount0Min,
          account,
          time
        )
        .send({ from: account });
    } else if (token1Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .removeLiquidityETH(
          token0Address,
          liquidity,
          amount0Min,
          amount1Min,
          account,
          time
        )
        .send({ from: account });
    } else {
      await routerContract.methods
        .removeLiquidity(
          token0Address,
          token1Address,
          liquidity,
          amount0Min,
          amount1Min,
          account,
          time
        )
        .send({ from: account });
    }
    swal("Hurray!!", "Liquidity Removed Successfully!", "success");
    return true;
  } catch (err) {
    swal("Oops!", "Liquidity Removal Unsuccessful!", "error");
    return false;
  }
  // }
}
