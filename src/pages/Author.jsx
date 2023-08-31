import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CardModal from "../components/layouts/CardModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import {
  changeDetailedUserInfo,
  selectCurrentUser,
  changeOtherUserInfo,
  selectOtherUser,
  selectDetailedUser,
} from "../redux/reducers/auth.reducers.ts";
import {
  changeItemsList,
  changeItemsListOfAUser,
  selectItemsOfAUser,
} from "../redux/reducers/nft.reducers.ts";
import {
  changeFollow,
  changeFollowList,
  changeFollowingList,
  selectFollowingList,
  selectFollowList,
  changeIsExists,
} from "../redux/reducers/flollow.reducers.ts";

import { BACKEND_URL, ipfsUrl } from "../config";
import isEmpty from "../utilities/isEmpty";

import avt from "../assets/images/avatar/avt.png";

var socket = io(`${BACKEND_URL}`);

const Author = () => {
  const { userId } = useParams(); //taget_id in making follow
  const dispatch = useAppDispatch();

  const currentUsr = useAppSelector(selectCurrentUser);
  const detailedUserInfo = useAppSelector(selectDetailedUser);

  const [isliked, setIsLiked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [collectedItems, setCollectedItems] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [detailedPL, setDetailedPlayList] = useState([]);
  const [panelTab, setPanelTab] = useState([]);
  const [menuTab] = useState([
    {
      class: "active",
      name: "COLLECTIBLES",
    },
    {
      class: "",
      name: "Created",
    },
    {
      class: "active",
      name: "Liked",
    },
    {
      class: "",
      name: "Following",
    },
    {
      class: "",
      name: "Followers",
    },
  ]);

  const [modalShow, setModalShow] = useState(false);
  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  // get NFT Item
  const getItemsOfUserByConditions = (params, userId) => {
    if (isEmpty(userId)) return;
    axios
      .post(
        `${BACKEND_URL}/api/item/get_items_of_user`,
        { ...params, userId: userId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        if (tabIndex + 1 === 1)
          setCollectedItems(result.data?.data ? result.data.data : []);
        if (tabIndex + 1 === 2)
          setCreatedItems(result.data?.data ? result.data.data : []);
        if (tabIndex + 1 === 3)
          setLikedItems(result.data?.data ? result.data.data : []);
        dispatch(
          changeItemsListOfAUser(result.data?.data ? result.data.data : [])
        );
      })
      .catch((err) => {
        console.log("get_items_of_user : ", err);
      });
  };

  // get Follower List
  const getFollowList = async (user_id, limit) => {
    if (isEmpty(user_id)) return;
    await axios
      .post(
        `${BACKEND_URL}/api/follow/get_follows`,
        { limit: limit, my_id: user_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log("UPDATE_FOLLOW_LIST : ", result.data.data);
        setFollowers(result.data.data || []);
        dispatch(changeFollowList(result.data.data || []));
      })
      .catch(() => {});
  };

  //get Following List
  const getFollowingList = async (user_id, limit) => {
    if (isEmpty(user_id)) return;
    await axios
      .post(
        `${BACKEND_URL}/api/follow/get_followings`,
        { limit: limit, my_id: user_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log("UPDATE_FOLLOWing_LIST : ", result.data.data);
        setFollowingAuthors(
          result.data && result.data.data ? result.data.data : []
        );
        dispatch(
          changeFollowingList(
            result.data && result.data.data ? result.data.data : []
          )
        );
      })
      .catch(() => {});
  };

  const getUserDetailedPlayHistory = async (userId) => {
    if (isEmpty(userId)) return;
    let tempPlayList = [];
    await axios
      .post(
        `${BACKEND_URL}/api/users/findOne`,
        { userId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        let simplePL = result.data.data.playList || [];
        console.log("simplePL = ", simplePL);
        tempPlayList = simplePL;
        setDetailedPlayList(tempPlayList);
      })
      .catch((err) => {});
  };

  // get user detail
  const getDetailedUserInfo = async (userId, isForMine = true) => {
    if (isEmpty(userId)) return;
    await axios
      .post(
        `${BACKEND_URL}/api/users/findOne`,
        { userId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log("[getDetailedUserInfo] : ", result.data.data);

        dispatch(changeDetailedUserInfo(result.data.data));
      })
      .catch(() => {
        console.log("Get detailed userInfo failed.");
      });
  };

  const getIsExists = (user_id, target_id) => {
    if (isEmpty(user_id) || isEmpty(target_id)) return;
    axios
      .post(
        `${BACKEND_URL}/api/follow/get_isExists`,
        { user_id, target_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        console.log("IS_FOLLOWING_EXISTS : ", result.data.data);
        dispatch(changeIsExists(result.data.data));
        setIsLiked(result.data.data);
      })
      .catch(() => {});
  };

  const toggleFollow = async (my_id, target_id) => {
    if (isEmpty(my_id) || isEmpty(target_id)) return;
    await axios
      .post(
        `${BACKEND_URL}/api/follow/toggle_follow`,
        { my_id, target_id },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeFollow({ follow_status: true }));
      })
      .catch(() => {
        dispatch(changeFollow({ follow_status: false }));
      });
    getIsExists(userId);
  };

  const toggleFollowing = (targetId) => {
    if (isEmpty(targetId) || isEmpty(currentUsr?._id)) {
      toast.warn("Please log in first.");
      return;
    }
    toggleFollow(currentUsr?._id || "", targetId);
  };

  //get tabs data
  useEffect(() => {
    let params = { start: 0, last: 1000, activeindex: tabIndex + 1 };
    if (tabIndex + 1 >= 1 && tabIndex + 1 <= 3 && userId !== undefined) {
      getItemsOfUserByConditions(params, userId ? userId : "");
    }
    if (tabIndex === 4) {
      getFollowList(userId || "", 10);
      setTimeout(() => {
        getFollowList(userId || "", 10);
      }, 1000);
    }
    if (tabIndex === 5) {
      getFollowingList(userId || "", 10);
      setTimeout(() => {
        getFollowList(userId || "", 10);
      }, 1000);
    }
    if (tabIndex === 6) {
      getUserDetailedPlayHistory(userId || "");
    }
  }, [tabIndex, userId]);

  // for page refresh
  useEffect(() => {
    getDetailedUserInfo(
      userId || "",
      (userId || "") === (currentUsr?._id || "")
    );
    getFollowList(userId || "", 10);
    getFollowingList(userId || "", 10);
    getIsExists(currentUsr?._id || "", userId || "");
  }, [userId]);

  useEffect(() => {
    const updatedPanelTab = [
      {
        id: 1,
        dataContent: collectedItems && collectedItems,
      },
      {
        id: 2,
        dataContent: createdItems && createdItems,
      },
      {
        id: 3,
        dataContent: likedItems && likedItems,
      },
      {
        id: 4,
        dataContent: followingAuthors && followingAuthors,
      },
      {
        id: 5,
        dataContent: followers && followers,
      },
    ];

    setPanelTab(updatedPanelTab);
  }, [collectedItems, createdItems, likedItems, followingAuthors, followers]);

  useEffect(() => {
    socket.on("UpdateStatus", (data) => {
      console.log(data);
      getDetailedUserInfo(
        userId || "",
        (userId || "") === (currentUsr?._id || "")
      );
      getFollowList(userId || "", 10);
      getFollowingList(userId || "", 10);
      getIsExists(currentUsr?._id || "", userId || "");
    });
  }, []);

  // console.log(panelTab);

  return (
    <div className="authors-2">
      <Header />
      <section className="tf-section authors">
        <div className="themesflat-container">
          <div className="flat-tabs tab-authors">
            <div className="author-profile flex">
              <div className="feature-profile">
                <img
                  src={`${detailedUserInfo?.avatar && ipfsUrl}${
                    detailedUserInfo?.avatar ? detailedUserInfo?.avatar : avt
                  }`}
                  alt="Axies"
                  className="avatar"
                />
              </div>
              <div className="infor-profile">
                <span>Author Profile</span>

                <div className="flex align-items-center">
                  <h2 className="title">
                    {detailedUserInfo?.firstname} {detailedUserInfo?.lastname}
                  </h2>
                  {detailedUserInfo?.verified && <div className="badge"></div>}
                </div>

                <p className="content">{detailedUserInfo?.bio}</p>
                <form>
                  <input
                    type="text"
                    className="inputcopy"
                    defaultValue={detailedUserInfo?.address}
                    readOnly
                  />
                  <button type="button" className="btn-copycode">
                    <i className="icon-fl-file-1"></i>
                  </button>
                </form>
              </div>
              <div className="widget-social style-3">
                <ul>
                  <li>
                    <a
                      href={detailedUserInfo?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li className="style-2">
                    <a
                      href={detailedUserInfo?.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-telegram-plane"></i>
                    </a>
                  </li>
                  <li className="style-2">
                    <a
                      href={detailedUserInfo?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook"></i>
                    </a>
                  </li>
                </ul>
                <div className="btn-profile">
                  <Link
                    className="sc-button style-1 follow"
                    onClick={() => toggleFollowing(userId)}
                  >
                    {isliked ? "Following" : "Follow"}
                  </Link>
                </div>
              </div>
            </div>
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                {menuTab.map((item, index) => (
                  <Tab key={index}>{item.name}</Tab>
                ))}
              </TabList>

              <div className="content-tab">
                <div className="content-inner">
                  <div className="row">
                    {panelTab.map((item, index) => {
                      return (
                        index < 3 && (
                          <TabPanel key={index}>
                            {item.dataContent
                              .slice(0, visible)
                              .map((data, index) => (
                                <div
                                  key={index}
                                  className="col-xl-3 col-lg-4 col-md-6 col-12"
                                >
                                  <div className="sc-card-product explode ">
                                    <div className="card-media">
                                      <Link to={`/item-details/${data._id}`}>
                                        <img
                                          src={`${ipfsUrl}${data?.logoURL}`}
                                          alt="NFT"
                                        />
                                      </Link>
                                      <div className="button-place-bid ">
                                        <button
                                          onClick={() => setModalShow(true)}
                                          className="sc-button style-place-bid style bag fl-button pri-3"
                                        >
                                          <span>Place Bid</span>
                                        </button>
                                      </div>
                                      <Link className="wishlist-button heart">
                                        <span className="number-like">
                                          {isliked ? "" : "0"}
                                        </span>
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
                                              detailedUserInfo?.avatar
                                                ? detailedUserInfo?.avatar
                                                : avt
                                            }`}
                                            alt="Avatar"
                                          />
                                        </div>
                                        <div className="info">
                                          <span>Creator</span>
                                          <h6>
                                            <Link to="/author">
                                              {data.name}
                                            </Link>
                                          </h6>
                                        </div>
                                      </div>
                                      {/* <div className="tags">{data.tags}</div> */}
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
                                      {/* <Link
                                    to="/activity-01"
                                    className="view-history reload"
                                  >
                                    View History
                                  </Link> */}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {visible < item.dataContent.length && (
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
                          </TabPanel>
                        )
                      );
                    })}
                    {panelTab.map((item, index) => {
                      return (
                        index > 2 && (
                          <TabPanel key={index}>
                            <div
                              key={index}
                              className="col-lg-4 col-md-6 col-12"
                            >
                              <div className="sc-card-collection style-2">
                                <div className="card-bottom">
                                  <div className="author">
                                    <div className="sc-author-box style-2">
                                      <div className="author-avatar">
                                        <img
                                          src={`${ipfsUrl}${
                                            item.avatar ? item.avatar : avt
                                          }`}
                                          alt="Avatar"
                                          className="avatar"
                                        />
                                        <div className="badge"></div>
                                      </div>
                                    </div>
                                    <div className="content">
                                      <h4>
                                        <Link to={`/author/${item?._id}`}>
                                          {item.nickname}
                                        </Link>
                                      </h4>
                                      <div className="infor">
                                        <span>{item.userBio}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Link className="sc-button fl-button pri-3">
                                    <span>Following</span>
                                  </Link>
                                </div>
                                <Link to={`/author/${item?._id}`}>
                                  <div className="media-images-collection">
                                    {item.gallery &&
                                      item.gallery.length > 0 && (
                                        <>
                                          <div className="box-left">
                                            <img
                                              src={`${ipfsUrl}${item.gallery[0]}`}
                                              alt="NFT"
                                            />
                                          </div>
                                          <div className="box-right">
                                            <div className="top-img">
                                              <img
                                                src={`${ipfsUrl}${item.gallery[1]}`}
                                                alt="NFT"
                                              />
                                              <img
                                                src={`${ipfsUrl}${item.gallery[2]}`}
                                                alt="NFT"
                                              />
                                            </div>
                                            <div className="bottom-img">
                                              <img
                                                src={`${ipfsUrl}${item.gallery[3]}`}
                                                alt="NFT"
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </TabPanel>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
      <Footer />
    </div>
  );
};

export default Author;
