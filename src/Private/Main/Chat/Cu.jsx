import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Img from '../../../Chatbox/Container/Chatb/Img'
import Cb from '../../../Chatbox/Container/Cb';
import { Conn } from '../../../Conn';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import Cbox from './Cbox/Cbox';
import Obj from '../../../Obj';
import {v4 as uuid} from 'uuid'
import CT from '../../../Chatbox/Container/Chatb/CT';
import Chatopt from './Cbox/Chatopt';

let Cu = () => {
    const { filtME, scp, setscp, owner, getKUser, users, setusers, chid, setchid, crl, setcrl, k, socket } = useContext(Conn);
    const [selectedId, setSelectedId] = useState(null);

    useLayoutEffect(() => {
        let ch = document.querySelector('.imgs')
        let s = scp
        let flt = s.find(v => v.id === 'cus')
        //
        if (!flt && ch) {
            // Assuming `ch` is your scrolling element
            ch.addEventListener('scroll', function (e) {
                let scrollTop = e.target.scrollTop;
                let ob = {
                    id: 'cus',
                    sp: scrollTop
                }

                let f = s.find(v => v.id === 'cus')
                if (f) {
                    f.sp = scrollTop
                    setscp(s)
                }
                else {
                    s.push(ob)
                    setscp(s)
                }
            });

        }
        else if (flt && ch) {
            setTimeout(() => {
                ch.scrollTo(0, flt.sp)
                // 
                ch.addEventListener('scroll', e => {

                    let scrollTop = e.target.scrollTop;

                    let ob = {
                        id: 'cus',
                        sp: scrollTop
                    }

                    let f = s.find(v => v.id === 'cus')
                    if (f) {
                        f.sp = scrollTop
                        setscp(s)
                    }
                    else {
                        s.push(ob)
                        setscp(s)
                    }

                })
            }, 200)
        }
    }, [])


    const items = [
        { id: 1, title: 'Profile' },
        { id: 2, title: 'New Contact' },
        // { id: 3, title: 'Settings' },
    ];

    //

    const [nu, setnu] = useState([])

    useLayoutEffect(() => {
        try {
            if (owner.length > 0 && users.length > 0) {
                let o = owner[0].contacts
                if (o.length > 0) {
                    let r = Obj.encDec(JSON.stringify({ o: o, j: owner[0].email }), `${k.s}+${window.navigator.userAgent.split(/\s+/).join('')}`)
                    if (r) {
                        let tx = new TextEncoder().encode(r)
                        socket.emit('privatejoin', tx)
                    }
                }

                // 
                socket.on('privatejoined', data => {
                    let u = users
                    let f = u.find(v => v.id === data.id)
                    if (f) {
                        f.online = data.online
                        // 
                        setusers(u)
                        setnu(u)
                        setcrl(uuid())
                    }
                })
                
                let u = users
                u.map(v => {
                    let s = v.messages.sort((a, b) => new Date(b.time) - new Date(a.time))
                    let nm = {
                        rc: s[0],
                        time: s[0].time
                    }
                    // 
                    let f = u.find(a => a.id === v.id)
                    if (f) {
                        f.recent = [nm]
                        let st = u.sort((a, b) => {
                            if (a.recent && b.recent) {
                                return new Date(b.recent[0].time) - new Date(a.recent[0].time);
                            } else {
                                if (!a.recent && !b.recent) return 0;
                                if (!a.recent) return 1;
                                if (!b.recent) return -1;
                            }
                        });

                        setusers(st)
                        setnu(st)
                        
                    }
                })
                // 
            }
        }
        catch { }
    }, [owner, users, crl])

    return (
        <>
            {
                (owner || []).map((v, k) => {
                    return (
                        <div key={k} className={` flex items-start justify-between flex-col w-full h-full overflow-hidden`}>
                            <div className="heeapartNow p-1 brd flex z-[1000000000] backdrop-blur-md items-center justify-between gap-2 w-full">
                                <motion.div onClick={() => setSelectedId(1)} layoutId={1} className={`userpcofile cursor-pointer min-w-[2rem] min-h-[2rem] h-8 w-8 overflow-hidden rounded-full`}>
                                    <Img id={v.id} type={`github`} len={getKUser(true).len} className={` h-full w-full min-w-full object-cover  object-top`} loading={`lazy`} isDEF={true} src={getKUser(true).picture} alt="" srcset="" />
                                </motion.div>
                                {/* searchS relative w-full bg-[var(--basebg)] p-1 rounded-full overflow-hidden" */}
                                <div className={``}>
                                    <div className="boltT">
                                        Private Chat
                                    </div>
                                    {/* <input spellCheck={'false'} placeholder={`Search Chat`} className={` w-full h-full outline-none bg-transparent pl-4 pr-4`} type="search" name="" id="" /> */}
                                </div>
                                <div className="lastdrp">
                                    <div className="dropdownoptions dropdown">
                                        <i className="bi bi-three-dots text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false" />
                                        <div className="dropdownmenuse z-[1000000000000] bg-[var(--mainBg)] backdrop-blur-md shadow-md brd dropdown-menu">
                                            {
                                                ([items[1]] || []).map((v, k) => {
                                                    return (
                                                        <motion.div onClick={() => setSelectedId(v.id)} key={k} layoutId={v.id} className={`dropdownitm dropdown-item`}>
                                                            {v.title}
                                                        </motion.div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contentpart relative imgs w-full h-full overflow-auto p-2 flex items-start gap-2 flex-col">
                                {
                                    users === false ?
                                        <>
                                            <div className="aina h-full uppercase w-full flex items-center justify-center opacity-[.6] mix-blend-multiply">
                                                Contact list is empty
                                            </div>
                                        </> :
                                        users.length < 1 ?
                                            <div className="aina h-full w-full flex items-center justify-center opacity-[.6] mix-blend-multiply">
                                                <i className="loading" />
                                            </div>
                                            :
                                            (nu || []).map((val, key) => {
                                                return (
                                                    <motion.div key={key} className="userone h-fit p-1 relative bg-[var(--basebg)] w-full rounded-xl brd flex items-center justify-between gap-1">
                    
                                                        {
                                                            val.online ?
                                                                <div title={`Online`} className="onlines  transition-all h-[2px] hover:h-full w-full bg-[#548ae0] absolute bottom-0 right-0" /> : ``
                                                        }
                                                        <div className="uLeft flex items-center justify-start gap-1 w-full h-full relative">
                                                            <motion.div className="userpps min-w-[2.5rem] min-h-[2.5rem] h-10 w-10 overflow-hidden rounded-full relative">
                                                                <Img id={val.id} len={val.picture ? getKUser(true, val).len : null} type={`github`} className={` h-full w-full min-w-full object-cover  object-top`} loading={`lazy`} isDEF={true} src={val.picture ? getKUser(true, val).picture : `${window.location.origin}/favicon.ico`} alt="" srcset="" />
                                                            </motion.div>
                                                            <motion.div onClick={() => setchid(val.id)} layoutId={val.id} className="unameandRch cursor-pointer w-full h-full flex items-start justify-center flex-col">
                                                                <div title={val.name} className="unameS text-sm line-clamp-1">
                                                                    {val.name}
                                                                </div>
                                                                <div className="smlt text-xs">
                                                                    {
                                                                        val.hasOwnProperty('recent') ?
                                                                            <>
                                                                                {
                                                                                    (val.recent || []).map((vl, kl) => {
                                                                                        return (
                                                                                            <div key={kl} className="ivC">
                                                                                                <div className="activeTime absolute top-0 right-0 text-[11px] opacity-[.6]">
                                                                                                    {new Date(vl.time).toLocaleString()}
                                                                                                </div>
                                                                                                {
                                                                                                    vl.rc.input.trim().length < 1 ? '' :
                                                                                                        <div title={filtME(vl.rc.input, vl.rc.time, null, val.id)} className="  text-[11px] opacity-[.5] flex items-center justify-start gap-1 ">
                                                                                                            {vl.rc.nid ? <><span>Replied: </span></> : ''} <CT title={filtME(vl.rc.input, vl.rc.time, null, val.id)} className={'line-clamp-1 max-w-[200px]'} userInput={filtME(vl.rc.input, vl.rc.time, null, val.id)} />
                                                                                                        </div>
                                                                                                }
                                                                                                {
                                                                                                    vl.rc.file.length < 1 ? '' :
                                                                                                        <div className=" text-[11px]  opacity-[.5] flex items-center justify-start gap-1">
                                                                                                            <i className="bi bi-file-earmark" />
                                                                                                            <span>File</span>
                                                                                                        </div>
                                                                                                }
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </>
                                                                            :
                                                                            ''
                                                                    }
                                                                </div>
                                                            </motion.div>
                                                        </div>

                                                        <div className="urite w-[2.5rem] h-full min-w-[3.8rem] gap-2 flex items-center justify-center">
                                                            <div className="lastdrp">
                                                                <div className="dropdownoptions dropdown">
                                                                    <i className="bi bi-three-dots text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false" />
                                                                    <Chatopt/>
                                                                </div>
                                                            </div>
                                                            {/* <div className="lastdrp">
                                                            <div className=" text-[.90rem] rounded-full overflow-hidden  cursor-pointer h-6 bg-[#cc3939] text-white w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false">
                                                                99+
                                                            </div>
                                                        </div> */}
                                                        </div>
                    
                                                    </motion.div>
                                                )
                                            })
                                }
                            </div>

                        </div>
            
                    )
                })
            }

            <Modal className={`bg-[var(--deep)] flex items-start justify-start flex-col overflow-hidden relative brd rounded-lg z-50 w-full max-w-[600px] max-h-[600px]`} items={items} selectedId={selectedId} setSelectedId={setSelectedId} />
            <Cbox crl={crl} className={` w-full h-full absolute top-0 z-[1000000000000000] bg-[var(--mainBg)]`} slid={chid} setslid={setchid} />
           
        </>
    );
};

export default Cu
