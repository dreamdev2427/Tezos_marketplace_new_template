import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  changeDetailedCollection,
  selectDetailedCollection,
} from "../redux/reducers/collection.reducers";
import { selectCurrentUser } from "../redux/reducers/auth.reducers";
import { selectETHPrice } from "../redux/reducers/nft.reducers.ts";
import { BACKEND_URL, ipfsUrl, chains, TEZOS_CHAIN_ID } from "../config";
import isEmpty from "../utilities/isEmpty";

import avt from "../assets/images/avatar/avt.png";
import CardNFT from "../components/layouts/CardNFT";
import { Backdrop, CircularProgress } from "@mui/material";

const CollectionItems = () => {
  const { collectionId } = useParams();

  const dispatch = useAppDispatch();

  const globalETHPrice = useAppSelector(selectETHPrice);
  const currentUsr = useAppSelector(selectCurrentUser);
  const collection = useAppSelector(selectDetailedCollection);

  const [items, setItems] = useState([]);
  const [start, setStart] = useState(0);
  const [last, setLast] = useState(8);
  const [viewNoMore, setViewNoMore] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [visible, setVisible] = useState(8);
  const [collectionMinPrice, setCollectionMinPrice] = useState(0);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const calcFloorPrice = (items) => {
    let isCollectionOnSale = false;
    for (let idx = 0; idx < items.length; idx++) {
      if (items[idx].isSale > 0) {
        isCollectionOnSale = true;
        break;
      }
    }

    if (isCollectionOnSale === true) {
      let minPrice = 0;
      for (let i = 1; i < items.length; i++) {
        if (items[i].isSale === 0) continue;
        if (items[i]?.isSale === 2) {
          if (items[i].bids && items[i].bids.length > 0) {
            minPrice = items[i].bids[items[i].bids.length - 1].price;
          }
        } else {
          minPrice = items[i]?.price;
        }
        break;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].isSale === 0) continue;
        if (items[i].isSale === 2) {
          if (items[i].bids && items[i].bids.length > 0) {
            if (minPrice > items[i].bids[items[i].bids.length - 1].price)
              minPrice = items[i].bids[items[i].bids.length - 1].price;
          }
        } else {
          if (minPrice > items[i].price) minPrice = items[i].price;
        }
      }
      setCollectionMinPrice(minPrice);
    } else {
      setCollectionMinPrice(0);
    }
  };

  const getCollectionList = (reStart, useStart) => {
    let currentItemCount = localStorage.getItem("currentItemIndex");
    if (currentItemCount === null || currentItemCount === undefined) {
      localStorage.setItem("currentItemIndex", "0");
    }

    var param = {
      start: reStart === true ? useStart : Number(currentItemCount),
      last:
        reStart === true
          ? useStart + 10
          : Number(currentItemCount) + Number(10),
    };
    param.collId = collectionId;
    param.userId = currentUsr?._id;

    if (reStart) {
      localStorage.setItem("currentItemIndex", "0");
      setItems([]);
    }
    setProcessing(true);
    setTimeout(() => {
      setViewNoMore(false);
    }, 2000);
    axios
      .post(`${BACKEND_URL}/api/collection/onSearchInACollection`, param)
      .then((result) => {
        var list = [];
        for (var i = 0; i < result.data.list.length; i++) {
          var item = result.data.list[i].item_info;
          item.isLiked = result.data.list[i].item_info.likes.includes(
            currentUsr._id
          );
          item.owner = result.data.list[i].owner_info;
          item.users = [{ avatar: result.data.list[i].creator_info.avatar }];
          list.push(item);
        }
        if (isEmpty(list)) {
          setViewNoMore(true);
        }
        if (reStart) {
          localStorage.setItem(
            "currentItemIndex",
            (Number(list.length) + useStart).toString()
          );
          setItems(list);
          calcFloorPrice(list);
        } else {
          setItems((items) => {
            localStorage.setItem(
              "currentItemIndex",
              (Number(currentItemCount) + Number(list.length)).toString()
            );
            calcFloorPrice(items.concat(list));
            return items.concat(list);
          });
        }
        setProcessing(false);
      })
      .catch(() => {
        setProcessing(false);
      });
  };

  // for page refresh
  useEffect(() => {
    axios
      .post(
        `${BACKEND_URL}/api/collection/detail`,
        { id: collectionId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeDetailedCollection(result.data.data));
      })
      .catch(() => {});

    getCollectionList(true, 0);
  }, [collectionId]);

  return (
    <div className="authors-2">
      <Header />
      <section className="tf-section authors">
        <div className="themesflat-container">
          <div className="flat-tabs tab-authors">
            <div
              className="author-profile flex"
              style={{
                background: `url(${collection?.bannerURL && ipfsUrl}${
                  collection?.bannerURL ? collection?.bannerURL : "inherit"
                })`,
              }}
            >
              <div className="feature-profile">
                <img
                  src={`${collection?.logoURL && ipfsUrl}${
                    collection?.logoURL ? collection?.logoURL : avt
                  }`}
                  alt="Axies"
                  className="avatar"
                />
              </div>
              <div className="infor-profile">
                <div className="flex align-items-center">
                  <h2 className="title">{collection?.name}</h2>
                  {collection?.verified && <div className="badge"></div>}
                </div>

                <span>
                  Created by : <b>{`${collection?.owner?.nickname}`}</b>
                </span>
                <br />
                <span>
                  Floor price:{" "}
                  {collectionMinPrice ? (
                    <b>
                      {collectionMinPrice}{" "}
                      {chains[collection?.chainId]?.currency}
                    </b>
                  ) : (
                    <b>
                      0 <b>{chains[collection?.chainId]?.currency}</b>
                    </b>
                  )}
                </span>

                <p>{collection && collection.description}</p>
              </div>

              <div className="widget-social style-3">
                {currentUsr && currentUsr?._id === collection?.owner?._id && (
                  <div className="btn-profile">
                    <Link
                      to={"/create-item"}
                      className="sc-button style-1 follow"
                    >
                      Create
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="content-tab">
              <div className="content-inner">
                <div className="row">
                  {items.slice(0, visible).map((data, index) => (
                    <div
                      key={index}
                      className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6"
                    >
                      <CardNFT item={data}></CardNFT>
                    </div>
                  ))}
                  {visible < items.length && (
                    <div className="col-md-12 wrap-inner load-more text-center">
                      <Link
                        to="#"
                        id="load-more"
                        className="sc-button loadmore fl-button pri-3"
                        onClick={showMoreItems}
                      >
                        <span>Load More</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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

export default CollectionItems;
