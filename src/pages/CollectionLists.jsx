import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import UserCollectionList from "../components/layouts/UserCollectionList";

const CollectionLists = () => {
  return (
    <div className="auctions">
      <Header />
      <UserCollectionList />
      <Footer />
    </div>
  );
};

export default CollectionLists;
