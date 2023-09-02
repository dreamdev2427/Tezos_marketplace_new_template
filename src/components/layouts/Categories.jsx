import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import CardModal from "./CardModal";
import { nftsCatImgs } from "../../contains/fakeData";
import { BACKEND_URL } from "../../config";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  changeCategorySummary,
  selectCategorySummary,
} from "../../redux/reducers/nft.reducers";
import Spinner from "../Spinner/Spinner";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

const Categories = () => {
  const dispatch = useAppDispatch();

  const globalCategorySummary = useAppSelector(selectCategorySummary);

  const [modalShow, setModalShow] = useState(false);
  const [summary, setSummary] = useState([]);
  const [loader, setLoader] = useState(false);

  const getSummaryOfCategories = async () => {
    setLoader(true);

    await axios
      .post(`${BACKEND_URL}/api/item/getSummaryByCollectionNames`)
      .then((response) => {
        if (response.data.code === 0) {
          setSummary(response.data.data);
        }
        dispatch(changeCategorySummary(response.data.data || []));
      })
      .catch((error) => {});
    setLoader(false);
  };

  useEffect(() => {
    getSummaryOfCategories();
  }, []);

  return (
    <Fragment>
      <section className="tf-section live-auctions">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions">
                <h2 className="tf-title pb-20">Browse by category</h2>
                {/* <Link to="/explore" className="exp style2">
                  EXPLORE MORE
                </Link> */}
              </div>
            </div>

            <div className="col-md-12">
              <Spinner isLoading={loader} />

              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
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
                  1300: {
                    slidesPerView: 4,
                  },
                }}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {summary?.slice(0, 7).map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-container show-shadow carousel auctions">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="slider-item">
                            <div className="sc-card-product">
                              <div className="card-media">
                                <Link to="/item-details-01">
                                  <img src={nftsCatImgs[index % 4]} alt="Cat" />
                                </Link>
                              </div>
                              <div className="card-title">
                                <h5>
                                  <Link
                                    to={`/ItemsCategory/${item.category.text}`}
                                  >
                                    {item.category.text}
                                  </Link>
                                </h5>
                                <div className="stock">
                                  {item.itemCounts} NFTs
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};
export default Categories;
