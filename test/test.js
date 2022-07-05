const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const {
  abi,
  data,
} = require("../ethereum/contracts/artifacts/KajuswapRouter.json");

let router;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  router = await new web3.eth.Contract(abi)
    .deploy({
      data: data.bytecode.object,
      arguments: ["0xb39b851e2243f97a5Cd6B9A24878540a3098bFCE"],
    })
    .send({ from: accounts[0] });
  console.log(
    "account0 address : ",
    accounts[0],
    "\nrouter address :",
    router.options
  );
});

describe("Router Contract", () => {
  it("deploys a contract", () => {
    assert.ok(router.options.address);
  });
});
