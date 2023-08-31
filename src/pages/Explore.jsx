import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import TodayPicks from "../components/layouts/TodayPicks";
import todayPickData from "../assets/fake-data/data-today-pick";

const Explore = () => {
  return (
    <div className="explore">
      <Header />
      <section className="flat-title-page inner">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Explore</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TodayPicks data={todayPickData} />
      <Footer />
    </div>
  );
};

export default Explore;
