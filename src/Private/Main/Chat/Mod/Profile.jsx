import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import PicPiv from './Prevpic';
import T from './T';
import { Conn } from '../../../../Conn';
import Img from '../../../../Chatbox/Container/Chatb/Img';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import axios from 'axios'
import Obj from '../../../../Obj';
import {v4 as uuid} from 'uuid'
import PH from './PH';
import {enc, dec} from 'medto'

let Profile = ({ selectedId, setSelectedId, isP, acid }) => {
    const { ReloadSocket, k, getKUser, owner, setowner, setcrl, pvid, setpvid } = useContext(Conn);
    const [loading, setloading] = useState(0)

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
                    setloading(p)
                },
                onDownloadProgress: e => {
                    const { loaded, total } = e;
                    const p = Math.round((loaded * 100) / total);
                    if (p === 100) {
                        setloading(null)
                    } else {
                        setloading(p)
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

    let handleUp = async (fl, chunks, b) => {
        try {
            let date = new Date();
            let abo = {
                exp: date.setSeconds(date.getSeconds() + 10),
            };

            let bj = {
                type: `picture`,
                time: new Date().getTime(),
                id: fl.id,
                picture: `/${fl.userid}/main/${fl.upT}/${fl.id}`,
                len: chunks.length
            }
                                        
            let ax = await axios.post(`https://clpb.onrender.com/private/profile/${uuid().split('-').join('').toUpperCase()}`, {
                Authorization: Obj.encDec(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                isAuth: localStorage.getItem('userid'),
                data: Obj.encDec(JSON.stringify(bj), `${k.p}+${window.navigator.userAgent.split(/\s+/).join('')}`),
            })
            // 
            if (ax.data && owner.length > 0) {
                if (b) {
                    AdPic(b, bj)
                    // 
                    // ReloadSocket()
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    };

    let AdPic = (blob, fl) => {
        try {
            let o = owner[0]
            // 
            fl.picture = blob
            fl.len = null
            o.picture.push(fl)
            setowner([o])
            // 
            setcrl(uuid())
        }
        catch { }
    }


    let uploadPic = async (e) => {
        try {
            let uid = uuid().split('-').join('').toUpperCase()
            if (owner.length > 0) {
                let file = e.target.files[0]
                if (file) {
                    if (file.type.includes('image')) {
                        let r = new FileReader()
                        r.onload = (e) => {
                            let blob = URL.createObjectURL(file)

                            const b = new Uint8Array(r.result);

                            const chunkSize = 200 * 1024; // 3MB
                            const chunks = [];
                
                            for (let offset = 0; offset < b.byteLength; offset += chunkSize) {
                                chunks.push(b.slice(offset, offset + chunkSize));
                            }
                            // 
                            let FLB = async (ob) => {
                                try {
                                    let fl = {
                                        userid: owner[0].id,
                                        upT: new Date().toDateString().split(/\s/).join('_'),
                                        ky: ob,
                                        file: JSON.stringify(chunks[ob]),
                                        id: uid,
                                    }
                                    if (ob <= chunks.length - 1) {
                                        let x = await AddProfile(fl)
                                        if (x) {
                                            FLB(ob + 1)
                                        }
                                        else {
                                            toast.warn(`Upload cancelled / Re_uploading...`)
                                            FLB(ob)
                                        }
                                    }
                                    else {
                                        handleUp(fl, chunks, blob)
                                    }
                                }
                                catch (er) {
                                    FLB(ob)
                                }
                            }

                            if (chunks.length > 0) {
                                FLB(0)
                            }
                            else {
                                toast.error(`Unable to chop your file.`)
                            }
                        }
                        r.readAsArrayBuffer(file)
                    }
                    else {
                        toast.error(`Invalid file type ${file.type}. We only allow image/* type of files`)
                    }
                }
            }
        }
        catch {
            toast.error(`Unable to load your file.`)
        }
    };

    // useEffect(() => {
    //     if (loading === null) {
    //         window.location.reload()
    //     }
    // }, loading);


    let actionData = async (data) => {
        try {
            let date = new Date();
            let abo = {
                exp: date.setSeconds(date.getSeconds() + 10),
            };
            // 
            let ax = await axios.post(`https://clpb.onrender.com/private/user/update/${uuid().split('-').join('').toUpperCase()}`, {
                Authorization: Obj.encDec(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                isAuth: localStorage.getItem('userid'),
                data: Obj.encDec(JSON.stringify(data), `${k.p}+${window.navigator.userAgent.split(/\s+/).join('')}`),
            })

            // ReloadSocket()
        }
        catch {
            toast.error(`Unable to update your data.`)
        }
    };

    return (
        <>
            {
                getKUser(true) ?
                    <>
                        {
                            (isP ? acid : owner || []).map((v, k) => {
                                return (
                                    <div key={k} className={` p-2`}>
                                        <div className={`profilepicCenter w-full flex-col gap-2 flex items-center justify-center`}>
                                            <div className="profilecont relative">
                                                <motion.div onClick={() => {
                                                    setSelectedId('pic')
                                                    setpvid(v.id)
                                                }
                                                } layoutId={'pic'} className={`clickAble w-[200px] h-[200px] overflow-hidden rounded-full  cursor-pointer relative`}>
                                                    <Img id={v.id} type={`github`} len={getKUser(true).len} isDEF={true} className={` w-full h-full object-cover object-top`} src={isP ? getKUser(true, acid[0]).picture : getKUser(true).picture} alt="" />
                                                </motion.div>
                                                <input onChange={loading ? e => { } : uploadPic} type="file" accept={`image/*`} className={`hidden`} id={`pf`} />
                                                {
                                                    !isP ?
                                                        <label htmlFor={loading ? '' : 'pf'} className="cameras flex items-center bottom-[5px] right-[20px] justify-center h-10 w-10 bg-[var(--basebg)] rounded-full brd backdrop-blur-md cursor-pointer absolute z-50">
                                                            <i className="bi bi-camera" />
                                                        </label> : ''
                                                }
                                                {
                                                    loading ?
                                                        <div className="lankesld absolute top-0 left-0 rounded-2xl text-xl shadow-md brd w-full h-full flex-col flex items-center justify-center z-[1000000000000] bg-[var(--mainBg)]">
                                                            <div className="loads">Saving</div>
                                                            <div className="asvain font-bold text-2xl">{loading}</div>
                                                        </div> : ``
                                                }
                                            </div>

                                            {
                                                isP ?
                                                    <div className="nameCenterB text-center line-clamp-2 text-3xl">
                                                        {v.name}
                                                    </div> :
                                                    <div className="nameCenterB text-center w-full">
                                                        <T type={`name`} callBack={actionData} isname={true} isEdit={true} data={v.name} />
                                                    </div>
                                            }
                                           
                                            <div className="personPhone flex items-center justify-center gap-2">
                                                <span>{v.phone}</span>
                                                <CopyToClipboard text={v.phone}
                                                    onCopy={() => toast.success(`Phone-Number copied`)}>
                                                    <i className="bi bi-copy cursor-pointer hover:text-[green] hover:scale-[1.1] transition-all" />
                                                </CopyToClipboard>
                                            </div>
                                            {
                                                !isP ?
                                                    <div className="simplenote text-center text-xs opacity-[.6] pb-2 pl-2 pr-2 pt-2">
                                                        ^^^ <br /> This is your generated phone number, it only works on this application. This phone number can be use to identify your account, you can share to someone, once they type it in their <b>NEW CONTACT</b>, they'll be able to add you to their contact. Once they contact you and after you've confirmed their message, they'll be added to your contact.
                                                    </div> : ``
                                            }
                                        </div>
                                        <hr />
                                        {
                                            v.hasOwnProperty('info') ?
                                                <div className="contentC">
                                                    <div className="aboutS text-2xl uppercase pb-4 opacity-[.8] bg-[var(--border)] backdrop-blur-md z-[100000000000] sticky top-0">
                                                        Info
                                                    </div>
                                                    {
                                                        (v.info || []).map((val, key) => {
                                                            return (
                                                                <T callBack={actionData} type={val.name} isEdit={isP ? false : true} label={val.name} data={val.data} key={key} />
                                                            )
                                                        })
                                                    }
                                                </div> : ''
                                        }
                                        <div className="contentyam">
                                            <div className="aboutS text-2xl uppercase p-2 opacity-[.8] bg-[var(--border)] backdrop-blur-md z-[10000000] sticky top-0">
                                                Profile History
                                            </div>
                                            <div className="gridPresent">
                                                <PH data={v.picture}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                    : ''
            }
        </>
    );
};

export default Profile
