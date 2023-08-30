import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { BACKEND_URL, ipfsUrl } from "../../config";

import {
  changeCollectionList,
  selectConllectionList,
} from "../../redux/reducers/collection.reducers";
import { selectCurrentUser } from "../../redux/reducers/auth.reducers";

const UserCollectionList = () => {
  const dispatch = useAppDispatch();
  const currentUsr = useAppSelector(selectCurrentUser);
  const collections = useAppSelector(selectConllectionList);

  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const fetchCollections = async (limit, currentUserId) => {
    setLoader(true);
    await axios
      .post(
        `${BACKEND_URL}/api/collection/getUserCollections`,
        { limit: limit, userId: currentUserId },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeCollectionList(result.data.data));
      })
      .catch(() => {});
    setLoader(false);
  };

  useEffect(() => {
    fetchCollections(90, currentUsr._id);
  }, [currentUsr._id]);

  return (
    <section className="tf-section live-auctions">
      {loader ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title-heading style-1 ct">My Collections</h2>
              <h4 className="sub-title style-1 ct">
                <Link
                  to="/create-item"
                  className="sc-button loadmore fl-button pri-3"
                >
                  <span>Create</span>
                </Link>
              </h4>
            </div>
            {collections.length > 0 ? (
              collections
                .slice(0, visible)
                .map((item, index) => (
                  <UserCollectionListItem key={index} item={item} />
                ))
            ) : (
              <h4>No Collection Items Found</h4>
            )}
            {visible < collections.length && (
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
      )}
    </section>
  );
};

const UserCollectionListItem = (props) => (
  <div className="fl-item col-xl-3 col-lg-6 col-md-6">
    <div className="sc-card-product">
      <div className="card-media">
        {/* <Link to={`/item-details/${props.item._id}`}> */}
        <img src={`${ipfsUrl}${props.item.bannerURL}`} alt="NFT" />
        {/* </Link> */}
      </div>
      <div className="card-title">
        <h5>{props.item.name}</h5>
        <div className="tags">{props.item.items?.length || 0} items</div>
      </div>
      <div className="meta-info">
        <div className="author">
          <div className="avatar">
            <img
              src={`${ipfsUrl}${props?.item.logoURL || ""}` || ""}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="info">
            <span>Creator</span>
            <h6>
              <Link to={`/collectionItems/${props.item._id}`}>
                {props.item.owner?.nickname}
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserCollectionList;
