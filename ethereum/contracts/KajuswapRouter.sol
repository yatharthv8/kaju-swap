//SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "../interfaces/IKajuswapPair.sol";
import "../interfaces/IKajuswapFactory.sol";
import "./KajuswapLibrary.sol";
import "../interfaces/IERC20.sol";

// import "hardhat/console.sol";

contract KajuswapRouter {
    // error ExcessiveInputAmount(string error1);
    // error InsufficientAAmount(string error2);
    // error InsufficientBAmount(string error3);
    // error InsufficientOutputAmount(string error4);
    // error SafeTransferFailed(string error5, address PA, address A);

    IKajuswapFactory factory;

    // address public PA;
    // address public A;
    // address public B;

    constructor(address factoryAddress) {
        factory = IKajuswapFactory(factoryAddress);
    }

    // event GetPairAddress(address pair, address from, address to);

    // function giveAddressses() public view returns (
    //         address,
    //         address,
    //         address
    //     ) {
    //     return (PA, A, B);
    // }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    )
        public
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        if (factory.pairs(tokenA, tokenB) == address(0)) {
            factory.createPair(tokenA, tokenB);
        }
        (amountA, amountB) = _calculateLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin
        );
        address pairAddress = KajuswapLibrary.pairFor(
            address(factory),
            tokenA,
            tokenB
        );

        _safeTransferFrom(tokenA, msg.sender, pairAddress, amountA);
        _safeTransferFrom(tokenB, msg.sender, pairAddress, amountB);
        liquidity = IKajuswapPair(pairAddress).mint(to);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    ) public returns (uint256 amountA, uint256 amountB) {
        address pair = KajuswapLibrary.pairFor(
            address(factory),
            tokenA,
            tokenB
        );
        IKajuswapPair(pair).transferFrom(msg.sender, pair, liquidity);
        (amountA, amountB) = IKajuswapPair(pair).burn(to);
        // if (amountA < amountAMin) revert InsufficientAAmount("InsufficientAAmount");
        // if (amountB < amountBMin) revert InsufficientBAmount("InsufficientBAmount");
        require(amountA >= amountAMin, "KajuswapRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "KajuswapRouter: INSUFFICIENT_B_AMOUNT");
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to
    ) public returns (uint256[] memory amounts) {
        amounts = KajuswapLibrary.getAmountsOut(
            address(factory),
            amountIn,
            path
        );
        // if (amounts[amounts.length - 1] < amountOutMin)
        // revert InsufficientOutputAmount("InsufficientOutputAmount");
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "KajuswapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        _safeTransferFrom(
            path[0],
            msg.sender,
            KajuswapLibrary.pairFor(address(factory), path[0], path[1]),
            amounts[0]
        );
        _swap(amounts, path, to);
    }

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to
    ) public returns (uint256[] memory amounts) {
        amounts = KajuswapLibrary.getAmountsIn(
            address(factory),
            amountOut,
            path
        );
        // if (amounts[amounts.length - 1] > amountInMax)
        //     revert ExcessiveInputAmount("ExcessiveInputAmount");
        require(
            amounts[0] <= amountInMax,
            "KajuswapRouter: EXCESSIVE_INPUT_AMOUNT"
        );
        _safeTransferFrom(
            path[0],
            msg.sender,
            KajuswapLibrary.pairFor(address(factory), path[0], path[1]),
            amounts[0]
        );
        _swap(amounts, path, to);
    }

    //
    //
    //
    //  PRIVATE
    //
    //
    //

    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address to_
    ) internal {
        for (uint256 i = 0; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = KajuswapLibrary.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2
                ? KajuswapLibrary.pairFor(address(factory), output, path[i + 2])
                : to_;
            IKajuswapPair(
                KajuswapLibrary.pairFor(address(factory), input, output)
            ).swap(amount0Out, amount1Out, to);
        }
    }

    function _calculateLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal returns (uint256 amountA, uint256 amountB) {
        (uint256 reserveA, uint256 reserveB) = KajuswapLibrary.getReserves(
            address(factory),
            tokenA,
            tokenB
        );

        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = KajuswapLibrary.quote(
                amountADesired,
                reserveA,
                reserveB
            ); //calculates output amount
            if (amountBOptimal <= amountBDesired) {
                // if (amountBOptimal <= amountBMin) revert InsufficientBAmount("InsufficientBAmount");
                require(
                    amountBOptimal >= amountBMin,
                    "KajuswapRouter: INSUFFICIENT_B_AMOUNT"
                );
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = KajuswapLibrary.quote(
                    amountBDesired,
                    reserveB,
                    reserveA
                );
                assert(amountAOptimal <= amountADesired);

                // if (amountAOptimal <= amountAMin) revert InsufficientAAmount("InsufficientAAmount");
                require(
                    amountAOptimal >= amountAMin,
                    "KajuswapRouter: INSUFFICIENT_A_AMOUNT"
                );
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function _safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) private {
        // emit GetPairAddress(token, from, to);
        // bool approved = IERC20(token).approve(address(this), value);
        // require(approved, "Kajuswap: TOKEN_APPROVAL_FAILED");

        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(
                bytes4(
                    keccak256(bytes("transferFrom(address,address,uint256)"))
                ),
                from,
                to,
                value
            )
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "Kajuswap: TRANSFER_FAILED"
        );
    }

    //
    //
    //        LIBRARY FUNCTIONS
    //
    //

    function quote(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        return KajuswapLibrary.quote(amountIn, reserveIn, reserveOut);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountOut) {
        return KajuswapLibrary.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountIn) {
        return KajuswapLibrary.getAmountIn(amountOut, reserveIn, reserveOut);
    }

    function getAmountsOut(uint256 amountIn, address[] memory path)
        public
        returns (uint256[] memory amounts)
    {
        return KajuswapLibrary.getAmountsOut(address(factory), amountIn, path);
    }

    function getAmountsIn(uint256 amountOut, address[] memory path)
        public
        returns (uint256[] memory amounts)
    {
        return KajuswapLibrary.getAmountsIn(address(factory), amountOut, path);
    }
}
