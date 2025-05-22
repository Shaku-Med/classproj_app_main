import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Navigation, EffectCoverflow, Pagination } from 'swiper/modules';
import IsFile from './isFile';
import Img from '../../../../Chatbox/Container/Chatb/Img';
import { Conn } from '../../../../Conn';

import { v4 as uuid } from 'uuid'
// 
let PicPiv = ({ sid, ssid, className, data, hasd, setpv }) => {
    const { getKUser, pvid, setpvid} = useContext(Conn);
    // 
    return (
        <AnimatePresence>
            <div className={`contC ${sid ? `z-[10000000000000] bg-[var(--mainBg)] fixed top-0 w-full h-full left-0 flex items-center justify-center` : `hidden opacity-0 pointer-events-none`}`}>
                {/* <div onClick={() => ssid(null)} className="dimsz fixed top-0 left-0 w-full transition-all h-full bg-[var(--basebg)] backdrop-blur-sm cursor-pointer" /> */}
                <div onClick={() => {
                    ssid(null)
                    if (hasd) {
                        setpv()
                    }
                }} className="exitP fixed hover:scale-[1.3] active:scale-[.90] bg-danger transition-all right-5 top-5 h-10 w-10 z-50 cursor-pointer flex items-center justify-center rounded-md brd">
                    <i className="bi bi-x-lg" />
                </div>
                {sid && (
                    <motion.div className={className} layoutId={sid}>
                        <Swiper coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }} pagination centeredSlides navigation modules={[Navigation, EffectCoverflow, Pagination]} spaceBetween={2} grabCursor className={` h-full w-full`}>
                            {
                                (data || []).map((v, k) => {
                                    return (
                                        <SwiperSlide className=' h-full w-full' key={k}>
                                            {
                                                v.hasOwnProperty('file') ? 
                                                    <IsFile /> : 
                                                    <Img hasFile={hasd ? v.hasOwnProperty('tyy') ? v.tyy.includes('image') ? null : v.tyy : null : null} id={hasd ? v.id ? v.id : v.picture : k === 0 ? pvid : v.id ? v.id : v.picture} type={`github`} len={v.len ? v.len : null} isDEF={true} className={` w-full h-full object-contain`} src={v.picture} alt="" />
                                            }
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};

export default PicPiv
