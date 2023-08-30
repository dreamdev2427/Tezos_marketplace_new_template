import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import liveAuctionData from "../assets/fake-data/data-live-auction";
import LiveAuction from "../components/layouts/auctions/LiveAuction";

const LiveAuctions = () => {
  return (
    <div className="auctions">
      <Header />
      <LiveAuction data={liveAuctionData} />
      <Footer />
    </div>
  );
};

export default LiveAuctions;
