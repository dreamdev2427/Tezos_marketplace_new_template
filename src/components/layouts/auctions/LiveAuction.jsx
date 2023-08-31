import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import { BACKEND_URL, ipfsUrl } from "../../../config";

import {
  changeCollectionList,
  changeConsideringCollectionId,
  selectConllectionList,
} from "../../../redux/reducers/collection.reducers";
import { selectCurrentUser } from "../../../redux/reducers/auth.reducers";
import Spinner from "../../Spinner/Spinner";

const LiveAuction = () => {
  const dispatch = useAppDispatch();
  const { category } = useParams();
  const currentUsr = useAppSelector(selectCurrentUser);
  const collections = useAppSelector(selectConllectionList);

  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const fetchCollections = async (limit) => {
    setLoader(true);
    await axios
      .post(
        `${BACKEND_URL}/api/collection/getCategoryCollections`,
        { limit: limit, category: category },
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
      <Spinner isLoading={loader} />
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="tf-title-heading style-1 ct">{category}</h2>
          </div>
          {collections.length >= 0 ? (
            collections
              .slice(0, visible)
              .map((item, index) => <LiveAuctionItem key={index} item={item} />)
          ) : (
            <h4>No {category} Category Items Found</h4>
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
    </section>
  );
};

const LiveAuctionItem = (props) => (
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

export default LiveAuction;
