import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Conn } from '../../../../Conn';
import Img from '../../../../Chatbox/Container/Chatb/Img';
import Cb from '../../../../Chatbox/Container/Cb';
import Cf from '../../../../Chatbox/Container/Cf';
import Chatopt from './Chatopt';
import Modal from '../Modal';

let Cbox = ({ slid, setslid, className, crl }) => {
    const { getKUser, input, SUB, users, setinput, setfile, setaction } = useContext(Conn);
    // 
    const [selectedId, setSelectedId] = useState(null);
    const [usr, setusr] = useState([])
    const [msg, setmsg] = useState([])
    const [acu, setacu] = useState([])
    // 
    useEffect(() => {
        try {
            let f = users.find(v => v.id === slid)
            if (f) {
                setusr([f])
                setmsg(f.messages)
            }
            else {
                setusr([])
                setmsg([])
            }
        }
        catch { }
    }, [slid, users, crl])
    // 
    let callBack = () => {
        try {
            SUB()
        }
        catch { }
    }
    return (
        <>
            <AnimatePresence>
                {slid && (
                    <motion.div className={`${className}`} layoutId={slid}>
                        {
                            (usr || []).map((v, k) => {
                                return (
                                    <div key={k} className="hspotts z-[10000000000000] flex items-center justify-center flex-col w-full h-full">
                                        <div className="headpoints z-[10000000000000000] w-full flex items-center p-1 brd backdrop-blur-md justify-between gap-2 bg-[var(--border)] relative">
                                            {
                                                v.online ?
                                                    <div title={`Online`} className="onlines z-[-1]  transition-all h-[2px] hover:h-full w-full bg-[#548ae0] absolute bottom-0 right-0" /> : ``
                                            }
                                            <div className="arrlefts flex items-center justify-start gap-2">
                                                <i onClick={() => {
                                                    setslid(null)
                                                    setaction({
                                                        type: null,
                                                        id: null
                                                    })
                                                    setinput('')
                                                    setfile([])
                                                }} className="bi bi-arrow-left text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" />
                                                <motion.div onClick={e => {
                                                    setSelectedId(`${v.id}_${k}`)
                                                    setacu([v])
                                                }} layoutId={`${v.id}_${k}`} className="userpps min-w-[2.5rem] min-h-[2.5rem] h-10 w-10 overflow-hidden rounded-full">
                                                    <Img id={v.id} len={v.picture ? getKUser(true, v).len : null} type={`github`} className={` h-full w-full min-w-full object-cover  object-top`} loading={`lazy`} isDEF={true} src={v.picture ? getKUser(true, v).picture : `${window.location.origin}/favicon.ico`} alt="" srcset="" />
                                                </motion.div>
                                            </div>
                                            <div className="nameCenters line-clamp-1">
                                                {v.name}
                                            </div>
                                            <div className="lastdrp relative">
                                                <div className="dropdownoptions dropdown">
                                                    <i className="bi bi-three-dots text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false" />
                                                    <Chatopt />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ainkeade relative h-full w-full">
                                            {
                                                msg ?
                                                    <Cb msga={msg} /> : ''
                                            }
                                        </div>
                                        <div className="cfoot w-full">
                                            <Cf callBack={callBack} isChat={true} />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </motion.div>
                )}
            </AnimatePresence>
            <Modal isP={true} className={`bg-[var(--deep)] flex items-start justify-start flex-col overflow-hidden relative brd rounded-lg z-50 w-full max-w-[600px] max-h-[600px]`} acid={acu} selectedId={selectedId} setSelectedId={setSelectedId} />
        </>
    );
};

export default Cbox
