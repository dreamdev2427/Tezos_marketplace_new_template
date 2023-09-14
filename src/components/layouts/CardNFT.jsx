import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL, TEZOS_CHAIN_ID, chains, ipfsUrl } from "../../config";
import avt from "../../assets/images/avatar/avt.png";
import axios from "axios";

const CardNFT = (props) => {
  const updateViews = () => {
    if (props.item._id?.toString()?.length === 24) {
      axios
        .post(`${BACKEND_URL}/api/item/updateViews`, {
          itemId: props.item?._id,
        })
        .then((response) => {})
        .catch((error) => {});
    }
  };
  return (
    <div className={`sc-card-product`}>
      <div className="card-media">
        <Link to={`/item-details/${props.item._id}`}>
          <img
            src={props.item.logoURL ? `${ipfsUrl}${props.item.logoURL}` : ""}
            style={{ height: "250px", objectFit: "cover" }}
            alt="axies"
            onClick={updateViews}
          />
        </Link>
        <div className="wishlist-button heart">
          <span className="number-like">{props.item.likes.length}</span>
        </div>
      </div>
      <div className="card-title">
        <h5 className="style2" onClick={updateViews}>
          <Link to={`/item-details/${props.item._id}`}>
            {props.item.name || "No name"}
          </Link>
        </h5>
        <div className="tags">
          {props.item.chainId === TEZOS_CHAIN_ID ? "Tezos" : "Avax"}
        </div>
      </div>
      <div className="meta-info">
        <div className="author">
          <div className="avatar">
            <img
              src={
                props.item.owner?.avatar
                  ? `${ipfsUrl}${props.item.owner?.avatar}`
                  : avt
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt="axies"
            />
          </div>
          <div className="info">
            <span>Owned By</span>
            <h6>
              {" "}
              <Link to={`/author/${props.item?.owner?._id}`}>
                {props.item.owner?.nickname}
              </Link>{" "}
            </h6>
          </div>
        </div>
        {props.item?.isSale > 0 ? (
          props.item?.isSale === 1 ? (
            <div className="price">
              <span>Current Price</span>
              <h5>
                {" "}
                {props.item.price}{" "}
                {chains[props.item.chainId || 1]?.currency || "ETH"}
              </h5>
            </div>
          ) : (
            <div className="price">
              <span>Current Bid</span>
              <h5>
                {" "}
                {props.item.bids.length > 0
                  ? props.item.bids[props.item.bids.length - 1].price
                  : props.item.price}{" "}
                {chains[props.item.chainId || 1]?.currency || "ETH"}
              </h5>
            </div>
          )
        ) : (
          <div className="price">
            <span>Unlisted</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardNFT;
