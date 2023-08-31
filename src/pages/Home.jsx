import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Categories from '../components/layouts/Categories';
import heroSliderData from '../assets/fake-data/data-slider-3';
import TopSeller from '../components/layouts/TopSeller';
import TopBuyer from '../components/layouts/TopBuyer';
import Slider from '../components/slider/Slider';
import PopularCollection from '../components/layouts/PopularCollection';

const Home = () => {
    return (
        <div className='home'>
            <Header />
            <Slider data={heroSliderData} />
            <Categories />
            <TopSeller />
            <TopBuyer />
            <PopularCollection />
            <Footer />
        </div>
    );
}

export default Home;
