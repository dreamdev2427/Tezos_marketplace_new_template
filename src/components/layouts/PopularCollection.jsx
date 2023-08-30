import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BACKEND_URL, ipfsUrl } from "../../config";

import { useDispatch } from "react-redux";
import {
  changeHotCollections,
  selectHotCollections,
} from "../../redux/reducers/collection.reducers";
import avt from "../../assets/images/avatar/avt.png";

var socket = io(`${BACKEND_URL}`);

const PopularCollection = () => {
  const dispatch = useDispatch();
  const globalHotCollections = useAppSelector(selectHotCollections);

  const getHotCollections = (time, limit) => {
    axios
      .post(
        `${BACKEND_URL}/api/collection/get_hot_collections`,
        { limit: limit },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changeHotCollections(result.data.data));
      })
      .catch((error) => {
        // console.log("error:", error);
      });
  };
  useEffect(() => {
    getHotCollections(0, 5);
  }, []);

  useEffect(() => {
    socket.on("UpdateStatus", (data) => {
      getHotCollections(0, 5);
    });
  }, []);
  console.log(globalHotCollections);
  return (
    <section className="tf-section popular-collection bg-home-3">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <h2 className="tf-title style2">Popular Collection</h2>
              <div className="heading-line"></div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="collection">
              <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={30}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  767: {
                    slidesPerView: 2,
                  },
                  991: {
                    slidesPerView: 3,
                  },
                }}
                navigation
                scrollbar={{ draggable: true }}
              >
                {globalHotCollections?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <PopularCollectionItem item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
PopularCollection.propTypes = {
  data: PropTypes.array.isRequired,
};

const PopularCollectionItem = (props) => (
  <div className="swiper-container show-shadow carousel4 button-arow-style">
    <div className="swiper-wrapper">
      <div className="swiper-slide">
        <div className="slider-item">
          <div className="sc-card-collection">
            <Link to={`/collectionItems/${props.item._id}`}>
              <div className="media-images-box">
                <img
                  src={`${ipfsUrl}${props.item?.collection_info?.bannerURL}`}
                  alt="Axies"
                />
                {/* <div className="bottom-media">
                  <img src={props.item.imgright1} alt="Axies" />
                  <img src={props.item.imgright2} alt="Axies" />
                  <img src={props.item.imgright3} alt="Axies" />
                </div> */}
              </div>
            </Link>
            <div className="card-bottom">
              <div className="author">
                <div className="sc-author-box style-2">
                  <div className="author-avatar">
                    <img
                      src={`${props.item.collection_info.logoURL && ipfsUrl}${
                        props.item.collection_info.logoURL
                          ? props.item.collection_info.logoURL
                          : avt
                      }`}
                      alt="Avatar"
                      className="avatar"
                    />
                    <div className="badge">
                      <i className="ripple"></i>
                    </div>
                  </div>
                </div>
                <div className="content">
                  <h4>
                    <Link to={`/author/${props.item.collection_info._id}`}>
                      {props.item.collection_info.name}
                    </Link>
                  </h4>
                  <div className="infor">
                    <span>Created by</span>
                    <span className="name">
                      <Link
                        to={`/collectionItems/${props.item.creator_info._id}`}
                      >
                        {props.item.creator_info?.nickname}
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PopularCollection;
