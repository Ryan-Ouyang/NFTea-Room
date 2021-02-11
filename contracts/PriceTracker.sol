// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

/**
 * @title PriceTracker
 * @dev Tracks Prices for various NFT's
 */
contract PriceTracker {
    address minion;
    mapping(uint8 => uint64) public nfts;

    constructor(address _minion) {
        minion = _minion;
    }

    event UpdatedPrice(
        uint8 id,
        uint64 oldPrice,
        uint64 newPrice,
        string message
    );
    event GetPrice(uint8 id, uint64 price, string message);

    // owner that it only the dao

    // update payment
    function updatePrice(uint8 _nftId, uint64 _price) public {
        require(msg.sender == minion);
        // find the nft in the mapping
        // change the price of the nft
        uint64 oldPrice = nfts[_nftId];
        uint64 newPrice = _price;
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
    function getPrice(uint8 _nftId) public {
        uint64 price = nfts[_nftId];
        require(price != 0, "The given NFT doesnt exist");
        emit GetPrice(_nftId, price, "Successfuly retrieved the Price");
    }
}
