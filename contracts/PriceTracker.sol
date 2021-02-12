// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

/**
 * @title PriceTracker
 * @dev Tracks Prices for various NFT's
 */
contract PriceTracker {
    address public minion;
    mapping(uint64 => uint256) public nfts;

    constructor(address _minion) {
        minion = _minion;
    }

    event UpdatedPrice(
        uint64 id,
        uint256 oldPrice,
        uint256 newPrice,
        string message
    );
    event GetPrice(uint64 id, uint256 price, string message);

    // owner that it only the dao

    // update payment
    function updatePrice(uint64 _nftId, uint256 _price) external {
        //require(msg.sender == minion);
        // find the nft in the mapping
        // change the price of the nft
        uint256 oldPrice = nfts[_nftId];
        uint256 newPrice = _price;
        require(
            oldPrice != newPrice,
            "Old Price and New Price are the same value"
        );
        nfts[_nftId] = newPrice;
        emit UpdatedPrice(
            _nftId,
            oldPrice,
            newPrice,
            "Successfuly updated the price"
        );
    }

    // get the price
    function getPrice(uint64 _nftId) public {
        uint256 price = nfts[_nftId];
        require(price != 0, "The given NFT doesnt exist");
        emit GetPrice(_nftId, price, "Successfuly retrieved the Price");
    }
}
