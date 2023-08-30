import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logodark from "../../assets/images/logo/wide_logo.png";

const Footer = () => {
  const accountList = [
    {
      title: "Authors",
      link: "/authors-01",
    },
    {
      title: "Collection",
      link: "/wallet-connect",
    },
    {
      title: "Author Profile",
      link: "/edit-profile",
    },
    {
      title: "Create Item",
      link: "/create-item",
    },
  ];
  const resourcesList = [
    {
      title: "Help & Support",
      link: "/help-center",
    },
    {
      title: "Live Auctions",
      link: "/live-auctions",
    },
    {
      title: "Item Details",
      link: "/item-details-01",
    },
    {
      title: "Activity",
      link: "/activity-01",
    },
  ];
  const companyList = [
    {
      title: "Explore",
      link: "/explore-01",
    },
    {
      title: "Contact Us",
      link: "/contact-01",
    },
    {
      title: "Our Blog",
      link: "/blog",
    },
    {
      title: "FAQ",
      link: "/faq",
    },
  ];
  const socialList = [
    {
      icon: "fab fa-twitter",
      link: "https://twitter.com/DAYL",
    },

    {
      icon: "fab fa-telegram-plane",
      link: "https://t.me/DAYL",
    },
    {
      icon: "fab fa-youtube",
      link: "https://www.youtube.com/channel/UCyLrMpD5-TeyXbbVTo71LTg",
    },
    {
      icon: "icon-fl-tik-tok-2",
      link: "https://www.tiktok.com/@DAYL",
    },
  ];

  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <footer id="footer" className="footer-light-style clearfix bg-style">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <div className="widget widget-logo">
                <div className="logo-footer" id="logo-footer">
                  <Link to="/">
                    <img
                      className="logo-dark"
                      id="logo_footer"
                      src={logodark}
                      alt="nft-gaming"
                    />
                  </Link>
                </div>
                {/* <p className="sub-widget-logo">
                  Lorem ipsum dolor sit amet,consectetur adipisicing elit. Quis
                  non, fugit totam vel laboriosam vitae.
                </p> */}
              </div>
            </div>
            {/* <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu style-1">
                <h5 className="title-widget">My Account</h5>
                <ul>
                  {accountList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-7 col-7">
              <div className="widget widget-menu style-2">
                <h5 className="title-widget">Resources</h5>
                <ul>
                  {resourcesList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-5 col-5">
              <div className="widget widget-menu fl-st-3">
                <h5 className="title-widget">Company</h5>
                <ul>
                  {companyList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            <div className="col-lg-3 col-md-6 col-sm-7 col-12 ml-lg-auto">
              <div className="widget widget-subcribe">
                <h5 className="title-widget">Subscribe Us</h5>
                <div className="form-subcribe">
                  <form
                    id="subscribe-form"
                    action="#"
                    method="GET"
                    acceptCharset="utf-8"
                    className="form-submit"
                  >
                    <input
                      name="email"
                      className="email"
                      type="email"
                      placeholder="info@yourgmail.com"
                      required
                    />
                    <button id="submit" name="submit" type="submit">
                      <i className="icon-fl-send"></i>
                    </button>
                  </form>
                </div>
                <div className="widget-social style-1 mg-t32">
                  <ul>
                    {socialList.map((item, index) => (
                      <li key={index}>
                        <Link to={item.link}>
                          <i className={item.icon}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {isVisible && <Link onClick={scrollToTop} to="#" id="scroll-top"></Link>}

      <div
        className="modal fade popup"
        id="popup_bid"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div className="modal-body space-y-20 pd-40">
              <h3>Place a Bid</h3>
              <p className="text-center">
                You must bid at least{" "}
                <span className="price color-popup">4.89 ETH</span>
              </p>
              <input
                type="text"
                className="form-control"
                placeholder="00.00 ETH"
              />
              <p>
                Enter quantity. <span className="color-popup">5 available</span>
              </p>
              <input type="number" className="form-control" placeholder="1" />
              <div className="hr"></div>
              <div className="d-flex justify-content-between">
                <p> You must bid at least:</p>
                <p className="text-right price color-popup"> 4.89 ETH </p>
              </div>
              <div className="d-flex justify-content-between">
                <p> Service free:</p>
                <p className="text-right price color-popup"> 0,89 ETH </p>
              </div>
              <div className="d-flex justify-content-between">
                <p> Total bid amount:</p>
                <p className="text-right price color-popup"> 4 ETH </p>
              </div>
              <Link
                to="#"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#popup_bid_success"
                data-dismiss="modal"
                aria-label="Close"
              >
                {" "}
                Place a bid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
