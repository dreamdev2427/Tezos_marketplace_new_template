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

import { getSystemTime } from "../utils/utils.ts";

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

// var socket = io(`${BACKEND_URL}`);

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

  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [sysTime, setSysTime] = useState(0);

  const getNftDetail = async (id) => {
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
        console.log(detailOfItem);
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
    // socket.on("UpdateStatus", (data) => {
    //   if (itemId) {
    //     if (data?.type === "BURN_NFT" && data?.data?.itemId === itemId) {
    //       navigate(`/collectionItems/${data?.data?.colId}`);
    //       return;
    //     }

    //     getNftDetail(itemId || "");
    //   }
    // });
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
                    alt="Avatar"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <h2 className="style2">“{globalDetailNFT?.name}”</h2>
                  <div className="meta-item">
                    <div className="left">
                      <span className="viewed eye">0</span>
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
                          <span>Create By</span>
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
                        <span className="heading style-2">Countdown</span>
                        <Countdown date={Date.now() + 500000000}>
                          <span>You are good to go!</span>
                        </Countdown>
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
                                          <Link to="/author-02">
                                            {item.name}{" "}
                                          </Link>
                                        </h6>{" "}
                                        <span> place a bid</span>
                                      </div>
                                      <span className="time">{item.time}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="price">
                                  <h5>
                                    {`${item?.price || 0} ${
                                      chains[item?.chainId || 1]?.currency ||
                                      "ETH"
                                    }s by `}
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
                                <div className="sc-author-box style-2">
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
                                    <div className="name">
                                      <h6>
                                        <Link
                                          to={`/author/${globalDetailNFT?.owner?._id}`}
                                        >
                                          {globalDetailNFT.nickname}{" "}
                                        </Link>
                                      </h6>{" "}
                                      <span>Owner </span>
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
                                                {item?.owner.name}{" "}
                                              </Link>
                                            </h6>{" "}
                                            <span>Owned by </span>
                                          </div>
                                          <span className="time">
                                            {item.time}
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
      <Categories />
      <Footer />
    </div>
  );
};

export default ItemDetails;
