import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BACKEND_URL, ipfsUrl } from "../../config";
import {
  changePopular,
  selectPopularUsers,
} from "../../redux/reducers/user.reducers";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/reducers/auth.reducers";
import avt from "../../assets/images/avatar/avt.png";
import Spinner from "../Spinner/Spinner";

const socket = io(`${BACKEND_URL}`);

const sortOrder = ["All", "Last 24 hours", "Last 7 days", "Last 30 days"];
const dateOptions = [
  { value: 0, text: "All" },
  { value: 1, text: "Last 24 hours" },
  { value: 2, text: "Last 7 days" },
  { value: 3, text: "Last 30 days" },
];
const directionOptions = ["Sellers", "Buyers"];

const TopBuyer = () => {
  const dispatch = useAppDispatch();
  const popular = useAppSelector(selectPopularUsers);
  const auth = useSelector(selectCurrentUser);

  const [date, setDate] = useState(sortOrder[0]);
  const [direction, setDirection] = useState(directionOptions[0]);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(false);

  const getPopularUserList = (time, limit) => {
    // time : timeframe, 0: all, 1: today, 2: this month, 3: 3 months, 4: year
    setLoader(true);

    axios
      .post(
        `${BACKEND_URL}/api/users/get_popular_user_list`,
        { limit: limit, time: time },
        {
          headers: {
            "x-access-token": localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((result) => {
        dispatch(changePopular(result.data.data));
      })
      .catch((error) => {
        // console.log("error:", error);
      });
    setLoader(false);
  };

  useEffect(() => {
    getPopularUserList(
      dateOptions.find((item) => item.text === date),
      20
    );
  }, [date]);

  useEffect(() => {
    socket.on("UpdateStatus", (data) => {
      getPopularUserList(
        dateOptions.find((item) => item.text === date),
        20
      );
    });
  }, []);

  useEffect(() => {
    setUserList();
  }, [popular, direction]);

  const setUserList = () => {
    if (popular) {
      if (direction === "Sellers") {
        setItems(popular.seller);
      } else {
        setItems(popular.buyer);
      }
    }
  };

  return (
    <section className="tf-section top-seller bg-home-3">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <h2 className="tf-title style2  mb-4">Top Seller</h2>
              {/* <div className="heading-line s1"></div> */}
            </div>
            <Spinner isLoading={loader} />
          </div>
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <TopBuyerItem key={index} item={item} />
            ))}
        </div>
      </div>
    </section>
  );
};

const TopBuyerItem = (props) => (
  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
    <div className="sc-author-box">
      <div className="author-avatar">
        <Link to={`/author/${props.item._id}`}>
          <img
            src={`${props.item.avatar && ipfsUrl}${
              props.item.avatar ? props.item.avatar : avt
            }`}
            alt="avatar"
            className="avatar"
          />
        </Link>
        <div className="badge">
          <i className="ripple"></i>
        </div>
      </div>
      <div className="author-infor">
        <h5 className="style2">
          <Link to={`/author/${props.item._id}`}>{props.item.nickname}</Link>
        </h5>
        <span className="price">{props.item.price}</span>
      </div>
    </div>
  </div>
);

export default TopBuyer;
