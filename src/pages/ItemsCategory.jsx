import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LiveAuction from "../components/layouts/auctions/LiveAuction";

const ItemsCategory = () => {
  return (
    <div className="categories">
      <Header />
      <LiveAuction />
      <Footer />
    </div>
  );
};

export default ItemsCategory;
