import React, { useContext, useLayoutEffect, useState } from 'react'
import Obj from '../../../../Obj';
import Img from '../../../../Chatbox/Container/Chatb/Img';
import { Conn } from '../../../../Conn';
import { motion } from 'framer-motion'
import PicPiv from './Prevpic';

let PH = ({ data }) => {
    const { getKUser, crl } = useContext(Conn);
    const [d, setd] = useState([])
    // 
    useLayoutEffect(() => {
        try {
            if (data) {
                if (data.length > 0) {
                    let reA = [];
                    let mg = data

                    let getFormattedDate = (timestamp) => {
                        const date = new Date(timestamp);
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${month}-${day}-${year}`;
                    };
                    // 
                    mg.map(v => {
                        const formattedDate = getFormattedDate(v.time);
                        const existingGroupIndex = reA.findIndex(group => group.date === formattedDate);
                        // 
                        if (existingGroupIndex !== -1) {
                            reA[existingGroupIndex].data.push(v);
                        } else {
                            reA.push({ date: formattedDate, data: [v], dt: v.time });
                        }
                    })
                    //
                    if (reA.length > 0) {
                        let srt = reA.sort((a, b) => new Date(b.dt) - new Date(a.dt))
                        setd(srt.reverse())
                    }
                }
                else {
                    setd([])
                }
            }
            else {
                setd([])
            }
        }
        catch { }
    }, [data, crl]);
    //
    const [pv, setpv] = useState([])
    const [picid, setpicid] = useState(null);
    //

    let handleSV = () => {
        // console.log('exit')
        setpv([])
    }
    return (
        <div>
            {
                (d || []).map((v, k) => {
                    return (
                        <div key={k} className="gridItem">
                            <div className="letdatecontainer sticky top-[48px] z-[10000] bg-primary opacity-[.6] uppercase p-2 items-center justify-between flex text-xs">
                                <div className="dina">
                                    {new Date(v.dt).toDateString()}
                                </div>
                                <div className="anotherdate">
                                    {Obj.DetMinDate(v.dt)}
                                </div>
                            </div>
                            <div className="gridStocks">
                                {
                                    (v.data || []).map((val, key) => {
                                        return (
                                            <div className="actionbtns flex items-center justify-between flex-col">
                                                <motion.div key={key} onClick={() => {
                                                setpicid(val.id ? val.id : val.picture)
                                                setpv([val])
                                            }
                                            } layoutId={val.id ? val.id : val.picture} className={` cursor-pointer h-full relative bg-[var(--border)] w-full`}>
                                                <Img id={val.id ? val.id : val.picture} len={val.picture ? val.len : null} type={`github`} className={` h-full w-full min-w-full object-cover  object-top`} loading={`lazy`} isDEF={true} src={val.picture ? val.picture : `${window.location.origin}/favicon.ico`} alt="" srcset="" />
                                                <div className={`uplTimes absolute bottom-0 flex items-center justify-between gap-1 left-[0px] w-full text-xs bg-[var(--basebg)] p-1 opacity-[.7]`}>
                                                    <span>
                                                        {Obj.DetMinDate(val.time)}
                                                    </span>
                                                    <span>
                                                        {new Date(val.time).toLocaleString()}
                                                    </span>
                                                </div>
                                                </motion.div>
                                                {/* <div className="actbtn flex items-center w-full justify-between">
                                                    <div className="btn1a cursor-pointer flex items-center justify-center text-center p-1 brd w-full">
                                                        Set Default
                                                    </div>
                                                    <div className="btn1a cursor-pointer flex items-center justify-center text-center p-1 brd w-full">
                                                        Delete
                                                    </div>
                                                </div> */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }

            {
                pv.length > 0 ? 
                    <PicPiv hasd={true} setpv={handleSV} data={pv} ssid={setpicid} sid={picid} className={' w-full h-full relative overflow-hidden max-w-[800px]'} /> : ''
            }
            {/*  */}
        </div>
    );
};

export default PH
