import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";
import { Dropdown } from "react-bootstrap";
import avt from "../../assets/images/avatar/avt.png";
import { BACKEND_URL, CATEGORIES, TEZOS_CHAIN_ID, ipfsUrl } from "../../config";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/reducers/auth.reducers";
import Spinner from "../Spinner/Spinner";
import CardNFT from "./CardNFT";
import { Backdrop, CircularProgress } from "@mui/material";

const TodayPicks = (props) => {
  const showMoreItems = () => {
    getCollectionList(false);
  };
  const [showLoadMore, setShowLoadMore] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [chainFilter, setChainFilter] = useState(0);
  const [fileTypeFilter, setFileTypeFilter] = useState(0);
  const [sortFilter, setSortFilter] = useState(0);
  const currentUsr = useAppSelector(selectCurrentUser);

  // useEffect(() => {
  //   getCollectionList(true);
  // }, []);

  useEffect(() => {
    localStorage.setItem("currentItemCount", "0");
    var param = {
      category: categoryFilter,
      sortmode: sortFilter,
      chain: chainFilter,
      status: statusFilter,
    };
    localStorage.setItem("searchFilter", JSON.stringify(param));
    getCollectionList(true);
  }, [categoryFilter, sortFilter, chainFilter, statusFilter]);

  const getCollectionList = (reStart) => {
    setProcessing(true);
    if (reStart) setItems([]);
    let filterParams = JSON.parse(
      localStorage.getItem("searchFilter").toString()
    );
    let currentItemCount = localStorage.getItem("currentItemCount");
    if (currentItemCount === null || currentItemCount === undefined) {
      localStorage.setItem("currentItemCount", "0");
    }
    var param = {
      start: reStart === true ? 0 : Number(currentItemCount),
      last: reStart === true ? 10 : Number(currentItemCount) + Number(10),
      category: filterParams.category,
      sortmode: filterParams.sort,
      chain: filterParams.chain,
      status: filterParams.status,
    };

    axios
      .post(`${BACKEND_URL}/api/collection/onsearch`, param)
      .then((result) => {
        var list = [];
        let currentInfo = localStorage.getItem("hideCollections");
        if (currentInfo === null || !currentInfo) currentInfo = "{}";
        else currentInfo = JSON.parse(currentInfo.toString());

        let currentInfo1 = localStorage.getItem("hideItems");
        if (currentInfo1 === null || currentInfo1 === undefined)
          currentInfo1 = "{}";
        else currentInfo1 = JSON.parse(currentInfo1.toString());
        for (var i = 0; i < result.data.list.length; i++) {
          var item = result.data.list[i].item_info;
          item.isLiked = result.data.list[i].item_info.likes.includes(
            currentUsr._id
          );
          item.owner = result.data.list[i].owner_info;
          item.users = [{ avatar: result.data.list[i].creator_info.avatar }];
          list.push(item);
        }
        if (list.length < 10) setShowLoadMore(false);
        if (reStart) {
          localStorage.setItem(
            "currentItemCount",
            (Number(currentItemCount) + Number(list.length)).toString()
          );
          setItems(list);
        } else {
          setItems((items) => {
            localStorage.setItem(
              "currentItemCount",
              (Number(currentItemCount) + Number(list.length)).toString()
            );
            return items.concat(list);
          });
        }
        setProcessing(false);
      })
      .catch(() => {
        setProcessing(false);
      });
  };
  return (
    <Fragment>
      <section
        className="tf-section sc-explore-1"
        style={{ paddingTop: "20px" }}
      >
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="wrap-box explore-1 flex mg-bt-40">
                <div className="seclect-box style-1">
                  <div id="item_category" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        By Categories
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setCategoryFilter(0)}
                        >
                          All
                        </Dropdown.Item>
                        {CATEGORIES?.map((cat, index) => (
                          <Dropdown.Item
                            key={"category_" + index}
                            href="#"
                            onClick={() => setCategoryFilter(index + 1)}
                          >
                            <span>{cat.text}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div id="buy" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        Buy Now
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setStatusFilter(0)}
                        >
                          All
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setStatusFilter(2)}
                        >
                          On Auction
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setStatusFilter(1)}
                        >
                          Instant Sale
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div id="all-items" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        By Chains
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setChainFilter(0)}
                        >
                          All
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setChainFilter(1)}
                        >
                          Avalanche
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setChainFilter(2)}
                        >
                          Tezos
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="seclect-box style-2 box-right">
                  {/* <div id="artworks" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        All Artworks
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item href="#">Abstraction</Dropdown.Item>
                        <Dropdown.Item href="#">Skecthify</Dropdown.Item>
                        <Dropdown.Item href="#">Patternlicious</Dropdown.Item>
                        <Dropdown.Item href="#">Virtuland</Dropdown.Item>
                        <Dropdown.Item href="#">Papercut</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div> */}
                  <div id="sort-by" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        Sort by
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setSortFilter(1)}
                        >
                          Top rate
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#"
                          onClick={() => setSortFilter(2)}
                        >
                          Low rate
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6"
              >
                <CardNFT item={item} />
              </div>
            ))}
            {showLoadMore && (
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
      {
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={processing}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </Fragment>
  );
};

export default TodayPicks;
