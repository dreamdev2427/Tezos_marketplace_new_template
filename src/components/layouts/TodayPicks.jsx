import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";
import { Dropdown } from "react-bootstrap";
import avt from "../../assets/images/avatar/avt.png";
import { BACKEND_URL, TEZOS_CHAIN_ID, ipfsUrl } from "../../config";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/reducers/auth.reducers";
import Spinner from "../Spinner/Spinner";
import CardNFT from "./CardNFT";

const TodayPicks = (props) => {
  const showMoreItems = () => {};
  const [showLoadMore, setShowLoadMore] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState(0);
  const [chainFilter, setChainFilter] = useState(0);
  const [fileTypeFilter, setFileTypeFilter] = useState(0);
  const [sortFilter, setSortFilter] = useState(0);
  const currentUsr = useAppSelector(selectCurrentUser);

  useEffect(() => {
    getCollectionList(true);
  }, []);

  const getCollectionList = (reStart) => {
    setProcessing(true);
    if (reStart) setItems([]);

    let currentItemCount = localStorage.getItem("currentItemCount");
    if (currentItemCount === null || currentItemCount === undefined) {
      localStorage.setItem("currentItemCount", "0");
    }

    var param = {
      start: reStart === true ? 0 : Number(currentItemCount),
      last: reStart === true ? 10 : Number(currentItemCount) + Number(10),
      category: categoryFilter,
      sortmode: sortFilter,
      chain: chainFilter,
      status: statusFilter,
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
      <section className="tf-section sc-explore-1">
        <Spinner isLoading={processing} />
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="wrap-box explore-1 flex mg-bt-40">
                <div className="seclect-box style-1">
                  <div id="item_category" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        All categories
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item href="#">Art</Dropdown.Item>
                        <Dropdown.Item href="#">Games</Dropdown.Item>
                        <Dropdown.Item href="#">Sports</Dropdown.Item>
                        <Dropdown.Item href="#">Photography</Dropdown.Item>
                        <Dropdown.Item href="#">Utility</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div id="buy" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        Buy Now
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item href="#">On Auction</Dropdown.Item>
                        <Dropdown.Item href="#">Instant Sale</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div id="all-items" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        All Items
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item href="#">Avalanche</Dropdown.Item>
                        <Dropdown.Item href="#">Tezos</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="seclect-box style-2 box-right">
                  <div id="artworks" className="dropdown">
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
                  </div>
                  <div id="sort-by" className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        Sort by
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ margin: 0 }}>
                        <Dropdown.Item href="#">Top rate</Dropdown.Item>
                        <Dropdown.Item href="#">Low rate</Dropdown.Item>
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
    </Fragment>
  );
};

TodayPicks.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TodayPicks;
