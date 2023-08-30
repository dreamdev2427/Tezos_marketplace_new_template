import Web3 from "web3";
import { store } from "../redux/store";
import axios from "axios";
import { changeUserBalance } from "../redux/reducers/auth.reducers";
import {
  nftContractAbi,
  platformContractAbi,
  chains,
  erc20ContractAbi,
} from "../config";

import { erc20Instance } from "./services/erc20Instance";

const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const aaveAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";

export const changeNetwork = async (provider, chainId) => {
  let globalWeb3 = new Web3(provider) || window?.web3;
  if (globalWeb3) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: globalWeb3.utils.toHex(chainId) }],
      });
      return {
        success: true,
        message: "switching succeed",
      };
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: globalWeb3.utils.toHex(chainId),
                chainName: "Network this site works on",
                rpcUrls: chains[chainId || 1].rpcURL,
              },
            ],
          });

          return {
            success: true,
            message: "switching succeed",
          };
        } catch (addError) {
          return {
            success: false,
            message: "Switching failed." + (addError.message || ""),
          };
        }
      } else {
        return {
          success: false,
          message: "Switching failed." + (switchError.message || ""),
        };
      }
    }
  } else {
    return {
      success: false,
      message: "Switching failed. Invalid web3",
    };
  }
};

export const signString = async (globalWeb3, data, chainId = 1) => {
  var address = data;
  var msgHash = globalWeb3.utils.keccak256(data);
  var signedString = "";

  try {
    await globalWeb3.eth.personal.sign(
      globalWeb3.utils.toHex(msgHash),
      address,
      function (err, result) {
        if (err) {
          console.error(err);
          return {
            success: false,
            message: err?.message || "",
          };
        }
        signedString = result;
      }
    );
    return {
      success: true,
      message: signedString,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const compareWalllet = (first, second) => {
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
};

const updateUserBalanceAfterTrading = async (globalWeb3, currentAddr) => {
  let balanceOfUser = await globalWeb3.eth.getBalance(currentAddr);
  balanceOfUser = globalWeb3.utils.fromWei(balanceOfUser);
  store.dispatch(changeUserBalance(Number(balanceOfUser) || 0));
};

const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length);
    let endPos = subStr.indexOf('"');
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
};

const getCurrentGasPrices = async (chainId) => {
  try {
    let GAS_STATION = `https://api.debank.com/chain/gas_price_dict_v2?chain=`;
    if (chainId === 1) GAS_STATION += "eth";
    else GAS_STATION += "bsc";
    var response = await axios.get(GAS_STATION);
    var prices = {
      low: Math.floor(response.data.data.slow.price),
      medium: Math.floor(response.data.data.normal.price),
      high: Math.floor(response.data.data.fast.price),
    };
    let log_str =
      "High: " +
      prices.high +
      "        medium: " +
      prices.medium +
      "        low: " +
      prices.low;
    console.log(log_str);
    return prices;
  } catch (error) {
    let prices = {
      low: 18000000000,
      medium: 16000000000,
      high: 15000000000,
    };
    return prices;
  }
};

export const setApproveForAll = async (
  globalWeb3,
  currentAddr,
  toAddr,
  chainId
) => {
  try {
    let nftContract = await new globalWeb3.eth.Contract(
      nftContractAbi,
      chains[chainId]?.nftContractAddress || ""
    );
    let isApproved = false;
    isApproved = await nftContract.methods
      .isApprovedForAll(currentAddr, toAddr)
      .call();
    if (isApproved === true) {
      return {
        success: 100,
        message: "You 've alreay approved our platform",
      };
    }
    var funcTrx = nftContract.methods.setApprovalForAll(toAddr, true);
    let gasFee = await funcTrx.estimateGas({
      from: currentAddr,
    });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await funcTrx.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Thank you for your approve for our platform.",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const GiveTip2Artist = async (
  globalWeb3,
  currentAddr,
  price,
  chainId,
  tipId,
  artist
) => {
  try {
    console.log("aaaaaaaaaaaaa");
    let utilityTokenContract = await new globalWeb3.eth.Contract(
      erc20ContractAbi,
      chains[chainId]?.utilityTokenAddress || ""
    );
    console.log("bbbbbbbbbbbb");

    let approvedAmount = await utilityTokenContract.methods
      .allowance(currentAddr, chains[chainId]?.platformContractAddress || "")
      .call();
    console.log("cccccccccccc");

    approvedAmount = globalWeb3.utils.toBN(approvedAmount);
    console.log("dddddddddddd");
    let amount = new globalWeb3.utils.toBN(price).mul(
      new globalWeb3.utils.toBN(Math.pow(10, 18).toString())
    );
    console.log("d1d1d1d1d1d1");

    if (approvedAmount - globalWeb3.utils.toBN(amount) < 0) {
      console.log("eeeeeeeeeeee");

      await utilityTokenContract.methods
        .approve(
          chains[chainId]?.platformContractAddress || "",
          globalWeb3.utils.toWei((2 ** 64 - 1).toString(), "ether")
        )
        .send({ from: currentAddr });
    }
    console.log("fffffffffff");

    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    console.log("ggggggggggg");
    var funcTrx = PinkFactoryContract.methods.giveTip2Artist(
      tipId,
      artist,
      amount
    );
    console.log("hhhhhhhhhhhh");
    let gasFee = await funcTrx.estimateGas({
      from: currentAddr,
    });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;
    console.log("iiiiiiiiiiiiiii");

    await funcTrx.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });
    return {
      success: true,
      message: `You've sent ${price} TheRadio tokens to artist`,
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const singleMintOnSale = async (
  globalWeb3,
  currentAddr,
  itemId,
  auctionInterval,
  auctionPrice,
  kind = 0,
  chainId
) => {
  /*
  Single Sell :  singleMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */

  if (
    auctionInterval === undefined ||
    auctionInterval <= 0 ||
    auctionInterval === null
  )
    auctionInterval = 0;

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let item_price = globalWeb3.utils.toWei(
      auctionPrice !== null ? auctionPrice.toString() : "0",
      "ether"
    );
    var interval = Math.floor(Number(auctionInterval)).toString();
    //let mintingFee = web3.utils.toWei(author.minting_fee !== null ? author.minting_fee.toString() : '0', 'ether');

    console.log(
      "singele mint on sale params : ",
      itemId,
      interval,
      item_price,
      kind
    );
    var funcTrx = PinkFactoryContract.methods.singleMintOnSale(
      itemId,
      interval,
      item_price,
      kind
    );
    let gasFee = await funcTrx.estimateGas({
      from: currentAddr,
    });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;
    // var nonce = await globalWeb3.eth.getTransactionCount(currentAddr, "pending");
    // nonce = globalWeb3.utils.toHex(nonce);

    await funcTrx.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Succeed on minting a item",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const placeBid = async (
  globalWeb3,
  currentAddr,
  tokenId,
  bidPrice,
  chainId
) => {
  /*
  Place Bid : function placeBid(string memory _tokenHash)
  */
  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let item_price = globalWeb3.utils.toWei(
      bidPrice !== null ? bidPrice.toString() : "0",
      "ether"
    );
    var placeBid = PinkFactoryContract.methods.placeBid(tokenId);

    let gasFee = await placeBid.estimateGas({
      from: currentAddr,
      value: item_price,
    });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await placeBid.send({
      from: currentAddr,
      value: item_price,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Succeed on putting a bid",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const destroySale = async (
  globalWeb3,
  currentAddr,
  tokenId,
  chainId
) => {
  /*
  Cancel Sale : destroySale(string memory _tokenHash)
  */

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    var destroySale = PinkFactoryContract.methods.destroySale(tokenId);
    let gasFee = await destroySale.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await destroySale.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Succeed on removed an item from sale",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const buyNow = async (
  globalWeb3,
  currentAddr,
  tokenId,
  price,
  chainId
) => {
  /*
  acceptOrEndBid(string memory _tokenHash)
  */

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let item_price = globalWeb3.utils.toWei(
      price !== null ? price.toString() : "0",
      "ether"
    );
    //alert("tokenHash = " +  tokenId + ", price=" + item_price);
    var buyNow = PinkFactoryContract.methods.buyNow(tokenId);
    let gasFee = await buyNow.estimateGas({
      from: currentAddr,
      value: item_price,
    });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await buyNow.send({
      from: currentAddr,
      value: item_price,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Succeed on bought an item",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const acceptOrEndBid = async (
  globalWeb3,
  currentAddr,
  tokenId,
  chainId
) => {
  /*
  acceptOrEndBid(string memory _tokenHash)
  */
  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    var acceptOrEndBid = PinkFactoryContract.methods.acceptOrEndBid(tokenId);
    let gasFee = await acceptOrEndBid.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await acceptOrEndBid.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "You've accepted a bid",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const batchMintOnSale = async (
  globalWeb3,
  currentAddr,
  itemIds = [],
  auctionInterval,
  auctionPrice,
  kind = 0,
  chainId
) => {
  /*
  Batch Sell :  batchMintOnSale(string memory _tokenHash, uint _interval, uint _startPrice, uint24 _royalty, uint8 _kind)
  */

  if (
    auctionInterval === undefined ||
    auctionInterval <= 0 ||
    auctionInterval === null
  )
    auctionInterval = 0;

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let item_price = globalWeb3.utils.toWei(
      auctionPrice !== null ? auctionPrice.toString() : "0",
      "ether"
    );
    var interval = Math.floor(Number(auctionInterval)).toString();

    var batchMintOnSale = PinkFactoryContract.methods.batchMintOnSale(
      itemIds,
      interval,
      item_price,
      kind
    );
    let gasFee = await batchMintOnSale.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await batchMintOnSale.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Succeed on minting multiple items",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const transferNFT = async (
  globalWeb3,
  currentAddr,
  toAddr,
  tokenId,
  chainId
) => {
  /*
    transferNFT(address to, string memory tokenHash)
  */

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    var transferNFT = PinkFactoryContract.methods.transferNFT(toAddr, tokenId);
    let gasFee = await transferNFT.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await transferNFT.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Successfully transfered a NFT",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const getBalanceOf = async (
  globalWeb3,
  currentAddr,
  tokenId,
  chainId
) => {
  /*
    //getBalanceOf(address user, string memory tokenHash, 0)   //0: our NFT, other : NFT's from other nft marketplaces
  */
  // alert(" address: " + currentAddr+", tokenhash = " +  tokenId);

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let queryRet = await PinkFactoryContract.methods
      .getBalanceOf(
        currentAddr,
        tokenId,
        "0x0000000000000000000000000000000000000000"
      )
      .call();

    // alert("queryRet = "+ queryRet);

    if (Number(queryRet) === 0)
      return 0; //token is on smart contract, it means the nft is on sale
    else return 1; // it means you have this NFT no on sale
  } catch (error) {
    console.log("Something went wrong 18: " + parseErrorMsg(error.message));
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const burnNFT = async (globalWeb3, currentAddr, tokenId, chainId) => {
  /*
    //burnNFT(string memory tokenHash)
  */
  // alert("tokenhash = " +  tokenId +  " address: " + currentAddr);

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    var burnNFT = PinkFactoryContract.methods.burnNFT(tokenId);
    let gasFee = await burnNFT.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await burnNFT.send({ from: currentAddr, gas: gasFee, gasPrice: gasPrice });

    return {
      success: true,
      message: "Successfully transfered a NFT",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};

export const changePrice = async (
  globalWeb3,
  currentAddr,
  tokenId,
  newPrice,
  chainId
) => {
  /*
    //changePrice(string memory tokenHash, uint256 newPrice)
  */

  try {
    let PinkFactoryContract = await new globalWeb3.eth.Contract(
      platformContractAbi,
      chains[chainId]?.platformContractAddress || ""
    );
    let item_price = globalWeb3.utils.toWei(
      newPrice !== null ? newPrice.toString() : "0",
      "ether"
    );

    var changePrice = PinkFactoryContract.methods.changePrice(
      tokenId,
      item_price
    );
    let gasFee = await changePrice.estimateGas({ from: currentAddr });
    let gasPrice = (await getCurrentGasPrices(chainId)).medium;

    await changePrice.send({
      from: currentAddr,
      gas: gasFee,
      gasPrice: gasPrice,
    });

    return {
      success: true,
      message: "Successfully changed price",
    };
  } catch (error) {
    return {
      success: false,
      message: parseErrorMsg(error.message),
    };
  }
};
