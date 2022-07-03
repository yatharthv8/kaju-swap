// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "../libraries/Math.sol";
import "../libraries/UQ112x112.sol";
import "../interfaces/IERC20.sol";

error AlreadyInitialized();

// error BalanceOverflow();
// error InsufficientInputAmount();
// error InsufficientLiquidity();
// error InsufficientLiquidityBurned();
// error InsufficientLiquidityMinted();
// error InsufficientOutputAmount();
// error InvalidK();
// error TransferFailed();

contract KajuswapPair is ERC20, Math {
    using UQ112x112 for uint224;

    uint256 constant MINIMUM_LIQUIDITY = 1000; //So that there is always some liquidity and the token prices don't start skyrocketing

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;

    bool private isEntered;

    event Burn(
        address indexed sender,
        uint256 amount0,
        uint256 amount1,
        address to
    );
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Sync(uint256 reserve0, uint256 reserve1);
    event Swap(
        address indexed sender,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    //Function to keep check on re-entracy vulnerability
    modifier lock() {
        require(!isEntered, "Kajuswap: You cannot Enter in the contract");
        isEntered = true;
        _;
        isEntered = false;
    }

    function getReserves()
        public
        view
        returns (
            uint112,
            uint112,
            uint32
        )
    {
        return (reserve0, reserve1, blockTimestampLast);
    }

    constructor() ERC20("Kajuswap Pair", "KAJU-LP", 18) {
        factory = msg.sender;
    } //Inherited the solmate ERC20 token implementation. Defining the name, symbol and decimals for the token.

    function initialize(address token0_, address token1_) public {
        //factory uses this at the time of token deployment
        require(msg.sender == factory, "Kajuswap: FORBIDDEN"); // sufficient check
        if (token0 != address(0) || token1 != address(0))
            revert AlreadyInitialized();
        //exits from the function. Transaction fails on revert. Why use revert? : Gas used up is returned.
        token0 = token0_;
        token1 = token1_;
    }

    function mint(address to) public lock returns (uint256 liquidity) {
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves(); //to save gas
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0 - reserve0_;
        uint256 amount1 = balance1 - reserve1_;

        if (totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            liquidity = Math.min(
                (amount0 * totalSupply) / reserve0_,
                (amount1 * totalSupply) / reserve1_
            );
        }

        // if (liquidity <= 0) revert InsufficientLiquidityMinted();
        require(liquidity > 0, "Kajuswap: INSUFFICIENT_LIQUIDITY_MINTED");

        _mint(to, liquidity);
        _update(balance0, balance1, reserve0_, reserve1_);
        emit Mint(to, amount0, amount1);
    }

    function burn(address to)
        public
        lock
        returns (uint256 amount0, uint256 amount1)
    {
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];

        amount0 = (liquidity * balance0) / totalSupply;
        amount1 = (liquidity * balance1) / totalSupply;

        // if (amount0 == 0 || amount1 == 0) revert InsufficientLiquidityBurned();
        require(
            amount0 > 0 && amount1 > 0,
            "Kajuswap: INSUFFICIENT_LIQUIDITY_BURNED"
        );

        _burn(address(this), liquidity);
        _safeTransfer(token0, to, amount0);
        _safeTransfer(token1, to, amount1);
        balance0 = IERC20(token0).balanceOf(address(this));
        balance1 = IERC20(token1).balanceOf(address(this));
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        _update(balance0, balance1, reserve0_, reserve1_);

        emit Burn(msg.sender, amount0, amount1, to);
    }

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to
    ) public lock {
        // if (amount0Out == 0 && amount1Out == 0)
        //     revert InsufficientOutputAmount();
        require(
            amount0Out > 0 || amount1Out > 0,
            "Kajuswap: INSUFFICIENT_OUTPUT_AMOUNT"
        );

        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();

        // if (amount0Out > reserve0_ || amount1Out > reserve1_)
        //     revert InsufficientLiquidity();
        require(
            amount0Out < reserve0_ && amount1Out < reserve1_,
            "Kajuswap: INSUFFICIENT_LIQUIDITY"
        );

        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);

        uint256 balance0 = IERC20(token0).balanceOf(address(this)); //token0 balance in this contract
        uint256 balance1 = IERC20(token1).balanceOf(address(this)); //token1 balance in this contract
        uint256 amount0In = balance0 > reserve0 - amount0Out
            ? balance0 - (reserve0 - amount0Out)
            : 0;
        uint256 amount1In = balance1 > reserve1 - amount1Out
            ? balance1 - (reserve1 - amount1Out)
            : 0;
        // if (amount0In == 0 && amount1In == 0) revert InsufficientInputAmount();
        require(
            amount0In > 0 || amount1In > 0,
            "Kajuswap: INSUFFICIENT_INPUT_AMOUNT"
        );

        // Adjusted = balance before swap - swap fee; fee stays in the contract
        uint256 balance0Adjusted = (balance0 * 1000) - (amount0In * 3);
        uint256 balance1Adjusted = (balance1 * 1000) - (amount1In * 3);

        // if (
        //     balance0Adjusted * balance1Adjusted <
        //     uint256(reserve0_) * uint256(reserve1_) * (1000**2)
        // ) revert InvalidK();
        require(
            balance0Adjusted * balance1Adjusted >=
                uint256(reserve0_) * uint256(reserve1_) * (1000**2),
            "Kajuswap: INVALID_K"
        );
        _update(balance0, balance1, reserve0_, reserve1_);
        emit Swap(msg.sender, amount0Out, amount1Out, to);
    }

    function sync() public lock {
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this)),
            reserve0_,
            reserve1_
        );
    }

    //
    //  PRIVATE
    //

    function _update(
        uint256 balance0,
        uint256 balance1,
        uint112 reserve0_,
        uint112 reserve1_
    ) private {
        // if (balance0 > type(uint112).max || balance1 > type(uint112).max)
        //     revert BalanceOverflow();
        require(
            balance0 <= type(uint112).max && balance1 <= type(uint112).max,
            "Kajuswap: OVERFLOW"
        );

        unchecked {
            //to disbable overflow/underflow as timeElapsed and CumulativePrice calculation will be out of bounds
            uint32 timeElapsed = uint32(block.timestamp) - blockTimestampLast;

            if (timeElapsed > 0 && reserve0_ > 0 && reserve1_ > 0) {
                price0CumulativeLast +=
                    uint256(UQ112x112.encode(reserve1_).uqdiv(reserve0_)) *
                    timeElapsed;
                price1CumulativeLast +=
                    uint256(UQ112x112.encode(reserve0_).uqdiv(reserve1_)) *
                    timeElapsed;
            }
        }

        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = uint32(block.timestamp);

        emit Sync(reserve0, reserve1);
    }

    //Most tokens implement transfer functions correctly but if there arises a case that transfer function doesn't return
    //anything, checking the sucess/failure of transaction is a problem, _safeTransfer helps in that.
    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        // (bool success, bytes memory data) = token.call(
        //     abi.encodeWithSignature("transfer(address,uint256)", to, value)
        // );
        // if (!success || (data.length != 0 && !abi.decode(data, (bool))))
        //     revert TransferFailed();

        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(
                bytes4(keccak256(bytes("transfer(address,uint256)"))),
                to,
                value
            )
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "Kajuswap: TRANSFER_FAILED"
        );
    }
}
