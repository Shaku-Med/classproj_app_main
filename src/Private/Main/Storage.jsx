import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect';
import { Conn } from '../../Conn';
import { toast } from 'react-toastify'
import Obj from '../../Obj';
import axios from 'axios'
import CryptoJS from 'crypto-js';
import {v4 as uuid} from 'uuid'
import Img from '../../Chatbox/Container/Chatb/Img';
import PicPiv from './Chat/Mod/Prevpic';
import { motion } from 'framer-motion'
import {enc, dec} from 'medto'

// 
let Storage = () => {


    const { scp, setscp, store, k, owner, setstore } = useContext(Conn);
    const [drag, setdrag] = useState(false)
    const [rl, setrl] = useState(0)
    const [srl, setsrl] = useState(0)
    const [st, setst] = useState([])
    const [lding, setlding] = useState([])
    const [loading, setloading] = useState([])
    const inputref = useRef(null)

    useLayoutEffect(() => {
        let ch = document.querySelector('.storage')
        let s = scp
        let flt = s.find(v => v.id === 'storage')
        //
        if (!flt && ch) {
            // Assuming `ch` is your scrolling element
            ch.addEventListener('scroll', function (e) {
                let scrollTop = e.target.scrollTop;
                let ob = {
                    id: 'storage',
                    sp: scrollTop
                }

                let f = s.find(v => v.id === 'storage')
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
                        id: 'storage',
                        sp: scrollTop
                    }

                    let f = s.find(v => v.id === 'storage')
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

    let ld = (id, value) => {
        try {
            let l = loading
            let f = l.find(v => v.id === id)
            if (f) {
                f.value = value
                setloading(l)
                setrl(uuid())
            }
            else {
                let obj = {
                    id,
                    value
                }
                l.push(obj)
                setloading(l)
                setrl(uuid())
            }
        }
        catch { }
    }

    let AddProfile = async (fl) => {
        try {
            let date = new Date();
            let abo = {
                exp: date.setSeconds(date.getSeconds() + 10),
            };
            // https://clpb.onrender.com
            let ax = await axios.post(`https://chatzy-silk.vercel.app`, {
                // Authorization: Obj.encDec(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                // isAuth: localStorage.getItem('userid'),
                ...fl
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': enc(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                    'isAuth': localStorage.getItem('userid') ? true : false
                },
                onUploadProgress: e => {
                    const { loaded, total } = e;
                    const p = Math.round((loaded * 100) / total);
                    ld(fl.id, p)
                },
                onDownloadProgress: e => {
                    const { loaded, total } = e;
                    const p = Math.round((loaded * 100) / total);
                    if (p === 100) {
                        ld(fl.id, p)
                    } else {
                        ld(fl.id, p)
                    }
                }
            });

            return ax.data
        }
        catch (e) {
            // console.log(e)
            return null
        }
    };



    let handleUp = async (fl, chunks, b, isaddau) => {
        try {
            let date = new Date();
            let abo = {
                exp: date.setSeconds(date.getSeconds() + 10),
            };

            let bj = {
                type: `add`,
                time: new Date().getTime(),
                id: fl.id,
                picture: isaddau ? b : `/${fl.userid}/main/${fl.upT}/${fl.id}`,
                len: chunks.length,
                tyy: fl.tyy,
                nm: fl.name
            }
                                        
            if (isaddau) {
                let s = store
                s.push(bj)
                setstore(s)
                setsrl(uuid())
            }
            else {
                let ax = await axios.post(`https://clpb.onrender.com/private/storage/${uuid().split('-').join('').toUpperCase()}`, {
                    Authorization: Obj.encDec(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                    isAuth: localStorage.getItem('userid'),
                    data: Obj.encDec(JSON.stringify(bj), `${k.s}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                })
                // 
            }
        }
        catch (e) {
            console.log(e)
        }
    };

    let handleFiles = async (e, isfile) => {
        try {
            let files = isfile ? e.target.files : e.dataTransfer.files
            if (files) {
                toast.info('upload in progress, Do not reload this page till done.')
                let fileStack = []
                for (let i = 0; i < files.length; i++) {
                    fileStack.push(i)
                }
                // 
                if (fileStack.length > 0) {
                    let sendF = (i) => {
                        if (i <= fileStack.length - 1) {
                            let uid = uuid().split('-').join('').toUpperCase();
                    
                            let r = new FileReader()
                            r.onload = (e) => {

                        
                                //
                                const b = new Uint8Array(r.result);
                                // 
                                let bl = new Blob([b], { type: files[i].type })
                                let blob = URL.createObjectURL(bl)

                                const chunkSize = 200 * 1024; // 3MB
                                const chunks = [];
                
                                for (let offset = 0; offset < b.byteLength; offset += chunkSize) {
                                    chunks.push(b.slice(offset, offset + chunkSize));
                                }

                    
                                let FLB = async (ob) => {
                                    try {
                                        let fl = {
                                            userid: owner[0].id,
                                            upT: new Date().toDateString().split(/\s/).join('_'),
                                            ky: ob,
                                            file: JSON.stringify(chunks[ob]),
                                            id: uid,
                                            tyy: files[i].type,
                                            name: files[i].name
                                        }
                                        if (ob <= chunks.length - 1) {
                                            let x = await AddProfile(fl)
                                            if (x) {
                                                FLB(ob + 1)
                                            }
                                            else {
                                                toast.info(`Upload cancelled / Re Uploading`)
                                                FLB(ob)
                                            }
                                        }
                                        else {
                                            handleUp(fl, chunks, blob)
                                            // 
                                            sendF(i + 1);
                                            // 
                                            if (i === files.length - 1) {
                                                toast.success(`Upload completed. No need to reload, everything has automatically being updated.`)
                                                // 
                                                setloading([])
                                                if (inputref.current) {
                                                    inputref.current.value = ''
                                                }
                                            }
                                        }
                                    }
                                    catch (er) {
                                        FLB(ob)
                                    }
                                }

                                if (chunks.length > 0 && owner.length > 0) {
                                    handleUp({ id: uid, tyy: files[i].type, name: files[i].name }, chunks, blob, true);
                                    // 
                                    FLB(0)
                                }
                                else {
                                    toast.error(`Unable to chop your file.`)
                                }
                            }
                            r.readAsArrayBuffer(files[i])
                        }
                        else {
                            toast.success(`Upload complete, your files have been saved.`)
                        }
                    }

                    sendF(0)
                }
            }
        }
        catch { }
    };

    let handleDrop = (e) => {
        e.preventDefault()
        setdrag(false)
        // 
        handleFiles(e)
    };

    useLayoutEffect(() => {
        try {
            if (store.length > 0) {
                let reA = [];
                let mg = store

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
                    setst(srt)
                }
            }
        }
        catch { }
    }, [store, srl]);

    useEffect(() => {
        setlding(loading)
    }, [loading, rl])


    const [pv, setpv] = useState([]);
    const [picid, setpicid] = useState(null);
    //

    let handleSV = () => {
        setpv([])
    }

    let handleDelete = async (id) => {
        try {
            if (window.confirm(`This is permanent \n\n Are you sure you want to delete this file? \n\n Click on (OK) to continue or (CANCLE) to ignore.`)) {

                let date = new Date();
                let abo = {
                    exp: date.setSeconds(date.getSeconds() + 10),
                };
                
                let bj = {
                    id: id,
                    type: 'remove'
                }

                let c = store
                let f = c.findIndex(v => v.id === id)
                if (f !== -1) {
                    c.splice(f, 1)
                    setstore(c)
                    setsrl(uuid())
                    // 
                    // 
                    let ax = await axios.post(`https://clpb.onrender.com/private/storage/${uuid().split('-').join('').toUpperCase()}`, {
                        Authorization: Obj.encDec(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                        isAuth: localStorage.getItem('userid'),
                        data: Obj.encDec(JSON.stringify(bj), `${k.s}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                    })
                }

            }
        }
        catch (e) {
            console.log(e)
            toast.error(`Unable to delete file.`)
        }
    };

    return (
        <>
            <div onDragOver={e => {
                e.preventDefault()
                setdrag(true)
            }} onDrop={handleDrop} className={`storage ${drag ? 'overflow-hidden' : 'overflow-auto'} h-full w-full relative`}>
                {
                    drag ?
                        <div className="dropOv uppercase opacity-[.9] flex-col fixed flex items-center justify-center h-full w-full left-0 bg-[var(--deep)] z-[1000000000000000] top-0">
                            <div className="upli">
                                <i className="bi bi-upload text-5xl" />
                            </div>
                            <div className="aidna text-xl text-info p-2">
                                Let go of it now
                            </div>
                        </div> : ''
                }
                <input ref={inputref} onChange={e => { handleFiles(e, true) }} multiple type="file" className=" hidden opacity-0" id="store" />
                <label htmlFor='store' className="storagepath text-center flex items-center justify-center gap-2 p-2">
                    <div className="adddfiles w-full p-2 min-h-[200px] cursor-pointer hover:bg-[var(--border)] bg-[var(--basebg)] flex items-center justify-center gap-2 rounded-md shadow-md flex-col overflow-hidden brd">
                        <i className="bi bi-file-earmark text-5xl" />
                        <div className="ad opacity-[.6]">
                            Drag / Drop / upload
                        </div>
                    </div>
                </label>

                <hr />

                <div className="contentSLd w-full">
                    {
                        (st || []).map((val, key) => {
                            return (
                                <div key={key} className="htable">
                                    <div className="headdderToclick sticky top-0 backdrop-blur-md z-[10000000] p-2 bg-[var(--basebg)] flex items-center w-full justify-between gap-2">
                                        <span>{Obj.DetMinDate(val.dt)}</span>
                                        {/* <span><i className="bi bi-caret-down" /></span> */}
                                    </div>
                                    <div className="gridStocks p-2">
                                        {
                                            (val.data || []).map((vt, kt) => {
                                                return (
                                                    <div key={kt} className="contentBush h-full">
                                                        <div className="pictureContent h-full overflow-hidden brd rounded-lg shadow-md">
                                                            <motion.div onClick={() => {
                                                                setpicid(vt.id ? vt.id : vt.picture)
                                                                setpv([vt])
                                                            }
                                                            } layoutId={vt.id ? vt.id : vt.picture} className="contentImg cursor-pointer p-2 rounded-md h-full min-h-[300px] max-h-[300px] overflow-hidden w-full">
                                                                {
                                                                    vt.tyy.includes('image') ?
                                                                        <Img id={vt.id ? vt.id : vt.picture} len={vt.picture ? vt.len : null} type={`github`} className={` h-full w-full min-w-full object-cover object-top`} loading={`lazy`} isDEF={true} src={vt.picture ? vt.picture : `${window.location.origin}/favicon.ico`} alt="" srcset="" /> :
                                                                        <div className="ailfeconte bg-[var(--border)] rounded-lg flex items-center justify-center h-full w-full flex-col gap-1">
                                                                            <div className="fileicon">
                                                                                <i className="bi bi-file-earmark text-xl" />
                                                                            </div>
                                                                            <div className="filecont text-sm opacity-[.7]">
                                                                                Click to open
                                                                            </div>
                                                                        </div>
                                                               }
                                                            </motion.div>
                                                            <div className="contentName text-sm text-center p-1">
                                                                <div className="aidnfalupertext">
                                                                    {vt.nm}
                                                                </div>
                                                                <div onClick={e => {handleDelete(vt.id)}} className="buttonsS brd w-full p-1 mt-2 cursor-pointer bg-danger rounded-md shadow-md">
                                                                    DELETE
                                                                </div>
                                                            </div>
                                                            {
                                                                (lding || []).map((v, k) => {
                                                                    if (v.id === vt.id) {
                                                                        return (
                                                                            <div key={k} className="uploadtimes relative p-1 bg-[var(--basebg)] w-full">
                                                                                <div style={{ width: `${v.value}%` }} className="uploadSm bg-primary w-[0] h-full absolute top-0 left-0" />
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <PicPiv hasd={true} setpv={handleSV} data={pv} ssid={setpicid} sid={picid} className={' w-full h-full relative overflow-hidden max-w-[800px]'} /> : ''
        </>
    );
};

export default Storage
