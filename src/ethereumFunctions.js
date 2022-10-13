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
    if (address === process.env.VUE_APP_WETH) {
      return {
        balance: parseFloat(
          web3.utils.fromWei(await web3.eth.getBalance(accountAddress), "ether")
        ).toFixed(4),
        symbol: "ETH",
      };
    }
    const token = new web3.eth.Contract(ERC20.abi, address);
    return {
      balance: parseFloat(
        web3.utils.fromWei(await web3.eth.getBalance(accountAddress), "ether")
      ).toFixed(4),
      symbol: await token.methods.symbol().call(),
    };
  } catch (err) {
    console.log("The getBalanceAndSymbol function had an error!", err);
    return false;
  }
}

export async function getTokenBalance(address, accountAddress) {
  if (address === process.env.VUE_APP_WETH) {
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
  token0Address,
  token1Address,
  amount,
  routerContract,
  accountAddress,
  slippageVal
) {
  const path = [token0Address, token1Address];
  let amountIn;
  if (amount > 0.001) {
    amountIn = web3.utils.toWei(String(amount), "ether");
  } else {
    amountIn = toWei(amount);
  } //amount should be int, return BN.js instance.
  const amountOut = await routerContract.methods
    .getAmountsOut(amountIn, path)
    .call();
  const amountOutMin = slippageCalc(slippageVal, amountOut[1]);
  // const token0 = new web3.eth.Contract(ERC20.abi, token0Address);
  console.log(
    "swapTokens->",
    amountIn,
    amountOutMin,
    amountOut,
    path,
    accountAddress
  );
  // await token0.methods
  //   .approve(routerContract.options.address, amountIn)
  //   .send({ from: accountAddress });
  try {
    if (token0Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .swapExactETHForTokens(amountOutMin, path, accountAddress)
        .send({ from: accountAddress, value: amountIn });
    } else if (token1Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .swapExactTokensForETH(
          String(amountIn),
          String(amountOutMin),
          path,
          accountAddress
        )
        .send({ from: accountAddress });
    } else {
      await routerContract.methods
        .swapExactTokensForTokens(amountIn, amountOutMin, path, accountAddress)
        .send({ from: accountAddress });
    }
  } catch (err) {
    alert("Something Happened! Transaction was not completed");
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

export async function getAmountIn(
  token0Address,
  token1Address,
  amountOut,
  routerContract
) {
  try {
    const values_in = await routerContract.methods
      .getAmountsIn(web3.utils.toWei(String(amountOut)), [
        token0Address,
        token1Address,
      ])
      .call();
    const amount_in = Number(web3.utils.fromWei(values_in[0], "ether"));
    return amount_in;
  } catch {
    alert(
      `You have entered values greater than reserves. Please see the values of corresponding reserves at the bottom of the screen and then enter values accordingly!`
    );
    return false;
  }
}

export async function getPairs(factory, accountAddress) {
  try {
    const pairLength = await factory.methods.getAllPairsLength().call();
    let pairs = [];
    for (let i = 0; i < pairLength; i++) {
      const pair = await factory.methods.allPairs(i).call();
      if (await checkIfLiquidityExists(pair, accountAddress)) {
        pairs.push(pair);
      }
    }
    // for (let i = 0; i < pairLength; ++i) {
    //   console.log(checkIfLiquidityExists(pairs[i], accountAddress));
    // }
    return pairs;
  } catch (err) {
    console.log("No pairs found --->>", err);
  }
}

const checkIfLiquidityExists = async (pairAddress, accountAddress) => {
  const pair = new web3.eth.Contract(PAIR.abi, pairAddress);
  const liquidityTokens_BN = await pair.methods
    .balanceOf(accountAddress)
    .call();
  // const liquidityTokens = web3.utils.fromWei(
  //   String(liquidityTokens_BN),
  //   "ether"
  // );
  // console.log("getReserves LT->", liquidityTokens_BN);
  if (liquidityTokens_BN > 0) {
    return true;
  }
  return false;
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
    alert("This pair does not exist! Add liquidity to create pair!");
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
    // console.log("getReserves LT->", liquidityTokens);
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
  const token0Bal = await getTokenBalance(token0Address, accountAddress);
  const token1Bal = await getTokenBalance(token1Address, accountAddress);
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
  factory,
  inpBox
) {
  const pairAddress = await factory.methods
    .pairs(token0Address, token1Address)
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
    .pairs(token0Address, token1Address)
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
  account
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
          account
        )
        .send({ from: account, value: amountIn0 });
    } else if (token1Address === process.env.VUE_APP_WETH) {
      await routerContract.methods
        .addLiquidityETH(
          token0Address,
          amountIn0,
          amount0Min,
          amount1Min,
          account
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
          account
        )
        .send({ from: account });
    }
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

  console.log([
    token0Address,
    token1Address,
    liquidity,
    amount0Min,
    amount1Min,
    account,
  ]);
  // const pairAddress = await factory.methods
  //   .pairs(token0Address, token1Address)
  //   .call();
  // const pair = new web3.eth.Contract(PAIR.abi, pairAddress);

  // await pair.methods
  //   .approve(routerContract.options.address, liquidity)
  //   .send({ from: account });

  // Token + Token
  if (token0Address === process.env.VUE_APP_WETH) {
    await routerContract.methods
      .removeLiquidityETH(
        token1Address,
        liquidity,
        amount1Min,
        amount0Min,
        account
      )
      .send({ from: account });
  } else if (token1Address === process.env.VUE_APP_WETH) {
    await routerContract.methods
      .removeLiquidityETH(
        token0Address,
        liquidity,
        amount0Min,
        amount1Min,
        account
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
        account
      )
      .send({ from: account });
  }
  // }
}
