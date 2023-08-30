import React from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import img1 from '../../assets/images/box-item/item-h5.1.png'
import img2 from '../../assets/images/box-item/item-h5.2.png'
import img3 from '../../assets/images/box-item/item-h5.3.png'

const SliderStyle2 = () => {
    const subtitle = 'NFT MARKETPLACE'
    const title = 'Discover, find and sell extraordinary monster NFTs'
    const description = 'Marketplace for monster character cllections non fungible token NFTs'
    return (
        <section className="flat-title-page home5">
            <div className="overlay"></div>
            <div className="themesflat-container">
                <div className="wrap-heading flat-slider d-flex align-items-center">
                    <div className="content">
                        <h4 className="mg-bt-11"><span className="fill">{subtitle}</span></h4>
                        <h1 className="heading">{title}                                                                                      
                        </h1>	
                        <p className="sub-heading mg-t-7 mg-bt-39">{description}
                        </p>
                        <div className="flat-bt-slider style2 flex">
                            <a href="/create-item" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Create
                            </span></a>
                            <a href="/explore-01" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Explore
                            </span></a>
                        </div>
                    </div>

                    <Swiper
                        modules={[ Autoplay ]}
                        direction={"vertical"}
                        spaceBetween={10}
                        slidesPerView={5}
                        loop
                        autoplay={{
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed= {2000}
                    >
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>

                    </Swiper>
                    <Swiper
                        modules={[ Autoplay ]}
                        direction={"vertical"}
                        spaceBetween={10}
                        slidesPerView={5}
                        loop
                        autoplay={{
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed= {2100}
                    >
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>

                    </Swiper>
                    <Swiper
                        modules={[ Autoplay ]}
                        direction={"vertical"}
                        spaceBetween={10}
                        slidesPerView={5}
                        loop
                        autoplay={{
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed= {2200}
                    >
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>

                    </Swiper>
                    <Swiper
                        modules={[ Autoplay ]}
                        direction={"vertical"}
                        spaceBetween={10}
                        slidesPerView={5}
                        loop
                        autoplay={{
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed= {2000}
                        className="end"
                    >
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                        <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>

                    </Swiper>
                   
                    
                </div>
            </div>                           
        </section>
    );
}



export default SliderStyle2;
