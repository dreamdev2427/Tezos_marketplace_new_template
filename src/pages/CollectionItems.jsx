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
import {
  selectCurrentUser,
} from "../redux/reducers/auth.reducers";

import { BACKEND_URL, ipfsUrl, chains } from "../config";
import isEmpty from "../utilities/isEmpty";

import avt from "../assets/images/avatar/avt.png";

const CollectionItems = () => {
  const { collectionId } = useParams();

  const dispatch = useAppDispatch();

  const currentUsr = useAppSelector(selectCurrentUser);
  const collection = useAppSelector(selectDetailedCollection);

  const [items, setItems] = useState([]);
  const [start, setStart] = useState(0);
  const [last, setLast] = useState(8);
  const [viewNoMore, setViewNoMore] = useState(false);

  const [visible, setVisible] = useState(8);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const itemsOfCollectionList = () => {
    var params = { start: start, last: last, date: 0, colId: collectionId };

    axios
      .post(`${BACKEND_URL}/api/item/get_items_of_collection`, params)
      .then((result) => {
        if (isEmpty(result.data.data)) {
          setViewNoMore(true);
          setTimeout(() => {
            setViewNoMore(false);
          }, 2500);
        }
        if (start === 0) {
          setItems(result.data.data);
        } else {
          let curItems = items;
          let moreItems = [],
            i;
          moreItems = result.data.data;
          if (moreItems.length > 0)
            for (i = 0; i < moreItems.length; i++) curItems.push(moreItems[i]);
          setItems(curItems);
        }
        setStart(last);
        setLast(last + 8);
      })
      .catch(() => {});
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

    itemsOfCollectionList();
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
                background: `url(${ipfsUrl}${
                  collection?.bannerURL ? collection?.bannerURL : "inherit"
                })`,
              }}
            >
              <div className="feature-profile">
                <img
                  src={`${ipfsUrl}${
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
                  {collection && collection.price
                    ? "Floor price : " +
                      collection.price +
                      chains[collection?.chainId]?.currency
                    : "Floor price : 0 " +
                      <b>{chains[collection?.chainId]?.currency}</b>}
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
                      className="col-xl-3 col-lg-4 col-md-6 col-12"
                    >
                      <div className="sc-card-product explode ">
                        <div className="card-media">
                          <Link to="/item-details-01">
                            <img src={`${ipfsUrl}${data?.logoURL}`} alt="NFT" />
                          </Link>
                        </div>
                        <div className="card-title mg-bt-16">
                          <h5>
                            <Link to={`/item-details/${data._id}`}>
                              "{data?.description}"
                            </Link>
                          </h5>
                        </div>
                        <div className="meta-info">
                          <div className="author">
                            <div className="avatar">
                              <img
                                src={`${ipfsUrl}${
                                  data?.logoURL
                                    ? data?.logoURL
                                    : avt
                                }`}
                                alt="Avatar"
                              />
                            </div>
                            <div className="info">
                              <span>Creator</span>
                              <h6>
                                <Link to="/author">{data.name}</Link>
                              </h6>
                            </div>
                          </div>
                          <div className="stock">
                            {data?.stockAmount || 1} in stock
                          </div>
                        </div>
                        <div className="card-bottom style-explode">
                          <div className="price">
                            <span>Current Bid</span>
                            <div className="price-details">
                              <h5>{data.price} ETH</h5>
                              <span>= {data.priceChange}</span>
                            </div>
                          </div>
                        </div>
                      </div>
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
    </div>
  );
};

export default CollectionItems;
