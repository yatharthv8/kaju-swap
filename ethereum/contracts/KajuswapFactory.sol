//SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "./KajuswapPair.sol";
import "../interfaces/IKajuswapPair.sol";

contract KajuswapFactory {
    // error IdenticalAddresses();
    // error ZeroAddress();
    // error PairExists();

    mapping(address => mapping(address => address)) public pairs;
    address[] public allPairs;

    bytes32 public constant INIT_CODE_HASH =
        keccak256(abi.encodePacked(type(KajuswapPair).creationCode));

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    function createPair(address tokenA, address tokenB)
        public
        returns (address pair)
    {
        // if (tokenA == tokenB) revert IdenticalAddresses();
        require(tokenA != tokenB, "Kajuswap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        // if (token0 == address(0)) revert ZeroAddress();
        // if (pairs[token0][token1] != address(0)) revert PairExists();
        require(token0 != address(0), "Kajuswap: ZERO_ADDRESS");
        require(pairs[token0][token1] == address(0), "Kajuswap: PAIR_EXISTS");

        bytes memory bytecode = type(KajuswapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1)); //sorted token addresses used as salt for consistency.
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt) //Written in Yul. Used CREATE2 opcode as it doesn't uses external state(nonce) for generating addresses
        }

        IKajuswapPair(pair).initialize(token0, token1);

        pairs[token0][token1] = pair;
        pairs[token1][token0] = pair;
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}
