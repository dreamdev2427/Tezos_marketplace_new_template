import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TodayPicks from '../components/layouts/TodayPicks'

const Explore = () => {
    return (
        <div className='explore'>
            <Header />
            <TodayPicks />
            <Footer />
        </div>
    );
}

export default Explore;
