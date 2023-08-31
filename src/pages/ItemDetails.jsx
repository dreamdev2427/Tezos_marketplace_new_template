import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Web3 from "web3";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import {
  changeItemDetail,
  changeItemOwnHistory,
  selectDetailOfAnItem,
  selectETHPrice,
  selectOwnHistoryOfAnItem,
} from "../redux/reducers/nft.reducers.ts";
import {
  selectCurrentChainId,
  selectCurrentUser,
  selectCurrentWallet,
  selectGlobalProvider,
  selectTezosInstance,
  selectWalletStatus,
} from "../redux/reducers/auth.reducers.ts";

import {
  mintTezosNFT,
  collectTezosNFT,
  delistTezosNFT,
  listTezosNFT,
  bidTezosNFT,
  acceptAuctionTezosNFT,
} from "../InteractWithSmartContract/tezosInteracts";

import {
  acceptOrEndBid,
  buyNow,
  destroySale,
  setApproveForAll,
  getBalanceOf,
  placeBid,
  singleMintOnSale,
  GiveTip2Artist,
} from "../InteractWithSmartContract/interact";

import { getSystemTime, timeStampToDate } from "../utils/utils.ts";

import {
  BACKEND_URL,
  CATEGORIES,
  TEZOS_CHAIN_ID,
  chains,
  ipfsUrl,
} from "../config";
import isEmpty from "../utilities/isEmpty";

import Categories from "../components/layouts/Categories";
import avt from "../assets/images/avatar/avt.png";
import Spinner from "../components/Spinner/Spinner";
import PutSale from "../components/layouts/PutonSale/PutSale";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Clock from "../components/Clock/Clock";
import Checkout from "../components/layouts/Checkout";
import Bid from "../components/layouts/Bid";
import Accept from "../components/layouts/Accept";

var socket = io(`${BACKEND_URL}`);

const ItemDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { itemId } = useParams();

  const globalDetailNFT = useAppSelector(selectDetailOfAnItem);
  const currentUsr = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalETHPrice = useAppSelector(selectETHPrice);
  const tezosInstance = useAppSelector(selectTezosInstance);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const globalProvider = useAppSelector(selectGlobalProvider);
  const globalOwnHistoryOfNFT = useAppSelector(selectOwnHistoryOfAnItem);
  const globalAccount = useAppSelector(selectCurrentWallet);

  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [sysTime, setSysTime] = useState(0);
  const [loader, setLoader] = useState(false);

  const getNftDetail = async (id) => {
    setLoader(true);

    await axios
      .post(
        `${BACKEND_URL}/api/item/get_detail`,
        { id: id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        const detailOfItem = result.data?.data;
        dispatch(changeItemDetail(result.data?.data || {}));

        if (isEmpty(currentUsr)) {
          toast.warn("Please login first!");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          return;
        }
        if (walletStatus === false) {
          toast.warn("Please connect your crypto wallet!");
          return;
        }
        if (
          (detailOfItem?.chain === TEZOS_CHAIN_ID &&
            isEmpty(currentUsr?.tezosaddress)) ||
          isEmpty(currentUsr?.address)
        ) {
          navigate("/account");
        }
      })
      .catch(() => {});

    await axios
      .post(
        `${BACKEND_URL}/api/item/get_owner_history`,
        { item_id: id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeItemOwnHistory(result.data.data || []));
      })
      .catch(() => {});
    setLoader(false);
  };

  const checkIsLiked = () => {
    if (globalDetailNFT && currentUsr) {
      if (!globalDetailNFT.likes) {
        setIsLiked(false);
      }
      var isIn = globalDetailNFT?.likes?.includes(currentUsr._id) || false;
      setIsLiked(isIn);
    }
  };

  useEffect(() => {
    getNftDetail(itemId || "");
    checkIsLiked();
    socket.on("UpdateStatus", (data) => {
      if (itemId) {
        if (data?.type === "BURN_NFT" && data?.data?.itemId === itemId) {
          navigate(`/collectionItems/${data?.data?.colId}`);
          return;
        }

        getNftDetail(itemId || "");
      }
    });
  }, [itemId, currentUsr]);

  //get system time
  useEffect(() => {
    if (globalDetailNFT?.isSale === 2) {
      (async () => {
        const res = await getSystemTime();
        setSysTime(res);
      })();
    }
  }, [globalDetailNFT]);

  //for like or unlike
  const setFavItem = async (target_id, user_id) => {
    if (isEmpty(target_id) || isEmpty(user_id)) return;
    await axios
      .post(
        `${BACKEND_URL}/api/users/set_fav_item`,
        { target_id: target_id, user_id: user_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then(async (result) => {
        await axios
          .post(
            `${BACKEND_URL}/api/item/get_detail`,
            { id: globalDetailNFT?._id || "" },
            {
              headers: {
                "x-access-token": localStorage.getItem("jwtToken"),
              },
            }
          )
          .then((result) => {
            dispatch(changeItemDetail(result.data.data || {}));
            checkIsLiked();
            setRefresh(!refresh);
          })
          .catch(() => {});
      });
  };

  // check wallet
  const checkWalletAddrAndChainId = async () => {
    if (
      isEmpty(currentUsr) === true ||
      currentUsr?._id === undefined ||
      currentUsr?._id === ""
    ) {
      toast.warn("You have to sign in before doing a trading.");
      return false;
    }
    if (walletStatus === false) {
      toast.warn("Please connect and unlock your wallet.");
      return false;
    }
    if (globalChainId !== globalDetailNFT?.chainId) {
      toast.warn(
        `Please reconnect to ${
          chains[Number(globalDetailNFT?.chainId)]?.name
        } and try again.`
      );
      return false;
    }
    return true;
  };

  const saveDelistItem = (id) => {
    axios
      .post(`${BACKEND_URL}/api/item/removeFromSale`, {
        itemId: id,
      })
      .then((response) => {
        if (response.data.code === 0) {
          toast.success("Succeed in delisting an item.");
        } else toast.error("Server side error");
      })
      .catch((error) => {
        toast.error("Server side error");
      });
  };

  const cofirmBuy = async () => {
    setVisibleModalPurchase(false);
    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }
    if (globalChainId === TEZOS_CHAIN_ID) {
      try {
        let success = await dispatch(
          collectTezosNFT({
            Tezos: tezosInstance,
            amount: globalDetailNFT?.price,
            contract: globalDetailNFT?.collection_id?.contract,
            id: globalDetailNFT?.tokenId,
          })
        );
        if (success) {
          await axios
            .post(`${BACKEND_URL}/api/item/buynow`, {
              itemId: globalDetailNFT._id,
              buyer: globalAccount,
              seller: globalDetailNFT.owner?.tezosaddress,
              price: globalDetailNFT.price,
            })
            .then((response) => {
              setProcessing(false);
              if (response.data.code === 0) {
                toast.success("Successfully bought an item.");

                getNftDetail(itemId || "");
              } else {
                toast.error("Server side error.");
              }
            })
            .catch((error) => {
              toast.error("Server side error.");
              setProcessing(false);
            });
        } else {
          toast.error("Transaction is failed!");
          setProcessing(false);
        }
      } catch (error) {
        console.log(error);
        setProcessing(false);
      }
    } else {
      let result = await buyNow(
        new Web3(globalProvider),
        currentUsr?.address,
        itemId,
        globalDetailNFT?.price,
        globalDetailNFT?.chainId || 1
      );
      if (result.success === true) {
        toast.success(
          result.message +
            "Check your new item in your profile 'Collectibles' ."
        );

        getNftDetail(globalDetailNFT?._id);
      } else toast.error(result.message);
    }
    setProcessing(false);
  };
  //remove sale
  const removeSale = async () => {
    setProcessing(true);
    if (globalDetailNFT?.owner?._id !== currentUsr?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }

    if (globalDetailNFT?.bids.length > 0 && globalDetailNFT?.isSale === 2) {
      toast.warn(
        "You cannot remove it from sale because you had one or more bid(s) already."
      );
      return;
    }
    if (globalDetailNFT?.chainId === TEZOS_CHAIN_ID) {
      let txResult = await delistTezosNFT({
        Tezos: tezosInstance,
        contract: globalDetailNFT?.collection_id?.contract,
        id: globalDetailNFT?.tokenId,
        instant: globalDetailNFT?.isSale === 1,
      });
      if (txResult === -1) {
        toast.error("Transaction Failed");
        setProcessing(false);
        return;
      }
      saveDelistItem(itemId);
      setProcessing(false);
      getNftDetail(globalDetailNFT?._id);
      return;
    }

    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    let iHaveit;
    iHaveit = await getBalanceOf(
      new Web3(globalProvider),
      currentUsr?.address,
      itemId,
      globalDetailNFT?.chainId || 1
    );
    if (iHaveit === 1) {
      setProcessing(false);
      toast.warn("Your NFT is not on sale.");
      return;
    }
    if (iHaveit && iHaveit.message) {
      toast.warn(`${iHaveit.message}`);
      return;
    }
    let result = await destroySale(
      new Web3(globalProvider),
      currentUsr?.address,
      itemId,
      globalDetailNFT?.chainId || 1
    );
    if (result.success === true) {
      toast.success(result.message);

      getNftDetail(globalDetailNFT?._id);
    } else toast.error(result.message);
    setProcessing(false);
  };

  const savelistItem = (id, price, auctionPeroid) => {
    axios
      .post(`${BACKEND_URL}/api/item/putOnSale`, {
        itemId: id,
        price: price,
        period: auctionPeroid,
      })
      .then((response) => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          toast.success("Succeed in listing an item.");
        } else toast.error("Server side error");
      })
      .catch((error) => {
        toast.error("Server side error");
      });
  };

  // put on sale
  const onPutSale = async (price, instant, period) => {
    setVisibleModalSale(false);
    var aucperiod = instant === true ? 0 : period;
    if (Number(price) <= 0 || isNaN(price)) {
      toast.error("Invalid price.");
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    if (globalDetailNFT?.chainId === TEZOS_CHAIN_ID) {
      let txResult = await listTezosNFT({
        Tezos: tezosInstance,
        id: globalDetailNFT?.tokenId,
        sender: globalAccount,
        contract: globalDetailNFT?.collection_id?.contract,
        price: price,
        instant: instant,
        auction: aucperiod * 24 * 3600,
      });
      if (txResult == -1) {
        toast.error("Transaction Failed");
        setProcessing(false);
        return;
      }
      savelistItem(itemId, price, aucperiod * 24 * 3600);
      setProcessing(false);
      getNftDetail(globalDetailNFT?._id);
      return;
    }

    let result = await setApproveForAll(
      new Web3(globalProvider),
      currentUsr?.address,
      chains[globalDetailNFT?.chainId]?.platformContractAddress || "",
      globalDetailNFT?.chainId || 1
    );
    if (result.success === true) toast.success(result.message);
    if (result.success === false) {
      toast.error(result.message);
      setProcessing(false);
      return;
    }
    result = await singleMintOnSale(
      new Web3(globalProvider),
      currentUsr?.address,
      itemId,
      aucperiod * 24 * 3600,
      price,
      0,
      globalDetailNFT?.chainId || 1
    );
    if (result.success === true) {
      toast.success(result.message);

      getNftDetail(globalDetailNFT?._id);
    } else toast.error(result.message);
    setProcessing(false);
  };

  const getLeftDuration = (created, period, curTime) => {
    var diff = created * 1000 + period * 1000 - curTime;
    return (diff = diff / 1000);
  };
  const onBid = async (bidPrice) => {
    setVisibleModalBid(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    if (
      getLeftDuration(
        globalDetailNFT?.auctionStarted,
        globalDetailNFT?.auctionPeriod,
        Date.now()
      ) <= 12
    ) {
      setTimeout(() => {
        setProcessing(false);
      }, 15000);
    }
    if (globalDetailNFT?.chainId === TEZOS_CHAIN_ID) {
      let result = await dispatch(
        bidTezosNFT({
          Tezos: tezosInstance,
          amount: Number(bidPrice),
          contract: globalDetailNFT?.collection_id?.contract,
          id: globalDetailNFT?.tokenId,
        })
      );

      if (result) {
        await axios
          .post(`${BACKEND_URL}/api/item/placeAbid`, {
            itemId: globalDetailNFT._id,
            bidder: currentUsr._id,
            price: bidPrice,
          })
          .then((response) => {
            if (response.data.code === 0) {
              setProcessing(false);
              toast.success("Successfully placed a bid.");
              getNftDetail(itemId || "");
            } else {
              setProcessing(false);
              toast.error("Server side error.");
            }
          })
          .catch((error) => {
            setProcessing(false);
            toast.error("Server side error.");
          });
      } else {
        toast.error("Transaction is failed!");
        setProcessing(false);
      }
    } else {
      let result = await placeBid(
        new Web3(globalProvider),
        currentUsr?.address,
        itemId,
        Number(bidPrice),
        globalDetailNFT?.chainId || 1
      );

      if (result.success === true) {
        toast.success(result.message);
        getNftDetail(globalDetailNFT?._id);
      } else toast.error(result.message);
    }
    setProcessing(false);
  };

  const onAccept = async () => {
    setVisibleModalAccept(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }
    if (globalDetailNFT?.chainId === TEZOS_CHAIN_ID) {
      let success = await dispatch(
        acceptAuctionTezosNFT({
          Tezos: tezosInstance,
          id: globalDetailNFT?.tokenId,
          contract: globalDetailNFT?.collection_id?.contract,
        })
      );
      if (success) {
        axios
          .post(`${BACKEND_URL}/api/item/acceptBid`, {
            itemId: globalDetailNFT._id,
          })
          .then((response) => {
            if (response.data.code === 0) {
              getNftDetail(itemId || "");
              toast.success("You sold an item.");
            } else toast.error("Server side error.");
            setProcessing(false);
          })
          .catch((error) => {
            setProcessing(false);
          });
      } else {
        toast.error("Transaction Failed");
        setProcessing(false);
        return;
      }
    } else {
      let result = await acceptOrEndBid(
        new Web3(globalProvider),
        currentUsr?.address,
        itemId,
        globalDetailNFT?.chainId || 1
      );
      if (result.success === true) {
        toast.success(result.message);

        getNftDetail(globalDetailNFT?._id);
      } else toast.error(result.message);
      setProcessing(false);
    }
  };
 
  return (
    <div className="item-details">
      <Header />
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  <img
                    src={
                      globalDetailNFT?.logoURL
                        ? `${ipfsUrl}${globalDetailNFT?.logoURL}`
                        : ""
                    }
                    style={{
                      height: "500px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt="Avatar"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <h2 className="style2">{globalDetailNFT?.name}</h2>
                  <div className="meta-item">
                    <div className="left">
                      <span className="viewed eye">{globalDetailNFT?.views}</span>
                      <span
                        onClick={() =>
                          setFavItem(globalDetailNFT?._id, currentUsr?._id)
                        }
                        className="liked heart wishlist-button mg-l-8"
                      >
                        <span className="number-like">
                          {globalDetailNFT?.likes
                            ? globalDetailNFT.likes.length
                            : 0}
                        </span>
                      </span>
                    </div>
                    <div className="right">
                      <Link to="#" className="share"></Link>
                      <Link to="#" className="option"></Link>
                    </div>
                  </div>
                  <div className="client-infor sc-card-product">
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img
                            src={
                              globalDetailNFT?.owner?.avatar
                                ? `${ipfsUrl}${globalDetailNFT.owner.avatar}`
                                : avt
                            }
                            alt="Avatar"
                          />
                        </div>
                        <div className="info">
                          <span>Owned By</span>
                          <h6>
                            <Link to={`/author/${globalDetailNFT?.owner?._id}`}>
                              {globalDetailNFT?.owner?.nickname || ""}
                            </Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img
                            src={
                              globalDetailNFT?.creator?.avatar
                                ? `${ipfsUrl}${globalDetailNFT.creator.avatar}`
                                : avt
                            }
                            alt="Avatar"
                          />
                        </div>
                        <div className="info">
                          <span>Created By</span>
                          <h6>
                            <Link
                              to={`/author/${globalDetailNFT?.creator?._id}`}
                            >
                              {globalDetailNFT?.creator?.nickname || ""}
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{globalDetailNFT?.description}</p>
                  <div className="meta-item-details style2">
                    <div className="item meta-price">
                      <span className="heading">
                        {globalDetailNFT?.isSale === 2
                          ? globalDetailNFT?.bids &&
                            globalDetailNFT.bids.length > 0
                            ? "Current Bid"
                            : "Start price"
                          : globalDetailNFT?.isSale === 1
                          ? "Instant Sale Price"
                          : "Price"}
                      </span>
                      <div className="price">
                        <div className="price-box">
                          <h5>
                            {globalDetailNFT?.isSale === 2
                              ? `${
                                  globalDetailNFT.bids &&
                                  globalDetailNFT.bids.length > 0
                                    ? globalDetailNFT.bids[
                                        globalDetailNFT.bids.length - 1
                                      ].price
                                      ? globalDetailNFT.bids[
                                          globalDetailNFT.bids.length - 1
                                        ].price
                                      : 0
                                    : globalDetailNFT?.price
                                } ${
                                  chains[globalDetailNFT?.chainId || 1]
                                    ?.currency || "ETH"
                                }`
                              : `${globalDetailNFT?.price || 0} ${
                                  chains[globalDetailNFT?.chainId || 1]
                                    ?.currency || "ETH"
                                }`}
                          </h5>
                          <span>
                            {globalDetailNFT?.isSale === 2
                              ? ` = $ ${
                                  globalDetailNFT.bids &&
                                  globalDetailNFT.bids.length > 0
                                    ? globalDetailNFT.bids[
                                        globalDetailNFT.bids.length - 1
                                      ].price
                                      ? (
                                          globalDetailNFT.bids[
                                            globalDetailNFT.bids.length - 1
                                          ].price *
                                          (globalDetailNFT?.chainId ===
                                          TEZOS_CHAIN_ID
                                            ? 0.79
                                            : globalETHPrice)
                                        )?.toFixed(2)
                                      : 0
                                    : (
                                        globalDetailNFT?.price *
                                        (globalDetailNFT?.chainId ===
                                        TEZOS_CHAIN_ID
                                          ? 0.79
                                          : globalETHPrice)
                                      )?.toFixed(2) || 0
                                } `
                              : `= $ ${
                                  (
                                    globalDetailNFT?.price *
                                    (globalDetailNFT?.chainId === TEZOS_CHAIN_ID
                                      ? 0.79
                                      : globalETHPrice)
                                  )?.toFixed(2) || 0
                                }`}
                          </span>
                        </div>
                      </div>
                    </div>
                    {globalDetailNFT?.isSale === 2 && (
                      <div className="item count-down">
                        <div className="py-9">
                          <div className="space-y-5">
                            <div className="flex align-items-center space-x-2 text-neutral-500 dark:text-neutral-400 ">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 8V13"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9 2H15"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="px-1 leading-none">
                                {auctionEnded
                                  ? "Auction period has expired"
                                  : "Auction ending in:"}{" "}
                              </span>
                            </div>
                            <div className="flex justify-content-center">
                              {!auctionEnded && (
                                <Clock
                                  nftItem={globalDetailNFT}
                                  sysTime={sysTime}
                                  setAuctionEnded={() => setAuctionEnded(true)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {globalDetailNFT &&
                  currentUsr &&
                  globalDetailNFT.isSale === 1 &&
                  globalDetailNFT.owner &&
                  globalDetailNFT.owner._id !== currentUsr._id ? (
                    <Link
                      onClick={() => setVisibleModalPurchase(true)}
                      className="sc-button loadmore style bag fl-button pri-3"
                    >
                      <span>Purchase now</span>
                    </Link>
                  ) : null}
                  {globalDetailNFT &&
                  currentUsr &&
                  globalDetailNFT.isSale === 2 &&
                  globalDetailNFT.owner &&
                  globalDetailNFT.owner._id !== currentUsr._id &&
                  !auctionEnded ? (
                    <Link
                      className="sc-button loadmore style bag fl-button pri-3"
                      onClick={() => setVisibleModalBid(true)}
                    >
                      <span>Place a bid</span>
                    </Link>
                  ) : null}
                  {globalDetailNFT &&
                  currentUsr &&
                  globalDetailNFT.isSale === 2 &&
                  globalDetailNFT.owner &&
                  globalDetailNFT.owner._id === currentUsr._id ? (
                    globalDetailNFT.bids.length > 0 ? (
                      <Link
                        className="sc-button loadmore style bag fl-button pri-3"
                        onClick={() => setVisibleModalAccept(true)}
                      >
                        <span>Accept</span>
                      </Link>
                    ) : (
                      <Link
                        className="sc-button loadmore style bag fl-button pri-3"
                        onClick={() => removeSale()}
                      >
                        <span>Remove from sale</span>
                      </Link>
                    )
                  ) : null}
                  {globalDetailNFT &&
                    currentUsr &&
                    globalDetailNFT.owner &&
                    globalDetailNFT.owner._id === currentUsr._id &&
                    globalDetailNFT.isSale === 0 && (
                      <Link
                        className="sc-button loadmore style bag fl-button pri-3"
                        onClick={() => setVisibleModalSale(true)}
                      >
                        <span>Put on sale</span>
                      </Link>
                    )}
                  {globalDetailNFT &&
                    currentUsr &&
                    globalDetailNFT.owner &&
                    globalDetailNFT.owner._id === currentUsr._id &&
                    globalDetailNFT.isSale === 1 && (
                      <Link
                        className="sc-button loadmore style bag fl-button pri-3"
                        onClick={() => removeSale()}
                      >
                        <span>Remove from sale</span>
                      </Link>
                    )}

                  <div className="flat-tabs themesflat-tabs">
                    <Tabs>
                      <TabList>
                        <Tab>Bid History</Tab>
                        <Tab>Info</Tab>
                        <Tab>Provenance</Tab>
                      </TabList>

                      <TabPanel>
                        <ul className="bid-history-list">
                          {globalDetailNFT?.bids?.map((item, index) => (
                            <li key={index} item={item}>
                              <div className="content">
                                <div className="client">
                                  <div className="sc-author-box style-2">
                                    <div className="author-avatar">
                                      <Link
                                        to={`/author/${item?.user_id?._id}`}
                                      >
                                        <img
                                          src={
                                            item?.user_id?.avatar
                                              ? `${ipfsUrl}${item.user_id.avatar}`
                                              : avt
                                          }
                                          alt="Avatar"
                                          className="avatar"
                                        />
                                      </Link>
                                      <div className="badge"></div>
                                    </div>
                                    <div className="author-infor">
                                      <div className="name">
                                        <h6>
                                          <Link
                                            to={`/author/${item?.user_id?._id}`}
                                          >
                                            {item?.user_id?.nickname}{" "}
                                          </Link>
                                        </h6>{" "}
                                        <span> place a bid</span>
                                      </div>
                                      <span className="time">
                                        {item.user_id?.createdAt}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="price">
                                  <h5>
                                    {`${item?.price || 0} ${
                                      chains[globalDetailNFT?.chainId || 1]
                                        ?.currency || "ETH"
                                    }`}
                                  </h5>
                                  <span>
                                    = ${" "}
                                    {(
                                      globalDetailNFT?.price *
                                      (globalDetailNFT?.chainId ===
                                      TEZOS_CHAIN_ID
                                        ? 0.79
                                        : globalETHPrice)
                                    )?.toFixed(2) || 0}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <ul className="bid-history-list">
                          <li>
                            <div className="content">
                              <div className="client">
                                <div className="sc-author-box style-2 align-items-center">
                                  <div className="author-avatar">
                                    <Link
                                      to={`/author/${globalDetailNFT?.owner?._id}`}
                                    >
                                      <img
                                        src={
                                          globalDetailNFT?.owner?.avatar
                                            ? `${ipfsUrl}${globalDetailNFT?.owner?.avatar}`
                                            : avt
                                        }
                                        alt="Avatar"
                                        className="avatar"
                                      />
                                    </Link>
                                    <div className="badge"></div>
                                  </div>
                                  <div className="author-infor">
                                    <div className="d-flex-col align-items-center">
                                      <span>Owner </span>
                                      <h6>
                                        <Link
                                          to={`/author/${globalDetailNFT?.owner?._id}`}
                                        >
                                          {globalDetailNFT.owner?.nickname}{" "}
                                        </Link>
                                      </h6>{" "}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <div className="provenance">
                          <ul className="bid-history-list">
                            {globalOwnHistoryOfNFT?.length > 0 &&
                              globalOwnHistoryOfNFT?.map((item, index) => (
                                <li key={index} item={item}>
                                  <div className="content">
                                    <div className="client">
                                      <div className="sc-author-box style-2">
                                        <div className="author-avatar">
                                          <Link
                                            to={`/author/${item?.owner._id}`}
                                          >
                                            <img
                                              src={
                                                item?.owner.avatar
                                                  ? `${ipfsUrl}${item.owner.avatar}`
                                                  : avt
                                              }
                                              alt="Avatar"
                                              className="avatar"
                                            />
                                          </Link>
                                          <div className="badge"></div>
                                        </div>
                                        <div className="author-infor">
                                          <div className="name">
                                            <h6>
                                              <Link
                                                to={`/author/${item?.owner._id}`}
                                              >
                                                {item?.owner.nickname}{" "}
                                              </Link>
                                            </h6>{" "}
                                            <span>Owned</span>
                                          </div>
                                          <span className="time">
                                            {item?.owner.createdAt}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PutSale
        onOk={onPutSale}
        show={visibleModalSale}
        onHide={() => setVisibleModalSale(false)}
      />
      <Checkout
        onOk={cofirmBuy}
        show={visibleModalPurchase}
        nft={globalDetailNFT}
        onHide={() => setVisibleModalPurchase(false)}
      />
      <Bid
        nft={globalDetailNFT}
        show={visibleModalBid}
        onOk={onBid}
        onHide={() => setVisibleModalBid(false)}
      />
      <Accept
        onOk={onAccept}
        show={visibleModalAccept}
        onHide={() => {
          setVisibleModalAccept(false);
        }}
        nft={globalDetailNFT}
      />
      <Categories />
      <Footer />
      {
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={processing}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </div>
  );
};

export default ItemDetails;
