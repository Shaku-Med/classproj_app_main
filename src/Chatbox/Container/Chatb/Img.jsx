import axios from 'axios'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {v4 as uuid} from 'uuid'
import { Conn } from '../../../Conn'
import Obj from '../../../Obj'

let Img = ({ loading, onLoad, className, src, isDEF, type, id, len , ncu, hasFile}) => {
    const { GetFiles, imgF, setimgF, CImg } = useContext(Conn);
    // 
    const ref = useRef(null)
    const [im, setim] = useState(null)

    let getImage = async (isd) => {
        try {
            if (isd) {
                setim(isd)
            }
            else {
                let sc = src.file
                let blob = new Blob([sc], { type: src.type })
                let rlu = URL.createObjectURL(blob)
                setim(rlu)

                let ab = imgF
                let ob = {
                    id: id,
                    url: `${rlu}+${hasFile ? hasFile : `image/png`}+${id}`
                }
                ab.push(ob)
                setimgF(ab)
            }
        }
        catch {
            toast.error(`Unable to load Image.`)
        }
    };

    const [rl, setrl] = useState(0)

    let GI = async (isd) => {
        try {
            if (isd) {
                setim(isd)
            }
            else {
                let rcs = src
                // /\b(?:https?|ftp|blob|smtp):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]|\b(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})\b|\b(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})\b/g)
                if (rcs.match(/\b(?:https?|blob):\/\/\S+/)) {
                    setim(src)
                }
                else {
                    if (len) {
                        let callBack = (psh) => {
                            let totalSize = psh.reduce((acc, chunk) => acc + chunk.length, 0);

                            const concatenatedArrayBuffer = new Uint8Array(totalSize);
                            let offset = 0;
                            psh.forEach(chunk => {
                                concatenatedArrayBuffer.set(new Uint8Array(chunk), offset);
                                offset += chunk.length;
                            });

                            let b = new Uint8Array(concatenatedArrayBuffer)
                            let bl = new Blob([b], { type: `${hasFile ? hasFile : `image/png`}` })
            
                            let rlu = URL.createObjectURL(bl)
                            setim(rlu);

                            let ab = imgF
                            let ob = {
                                id: id,
                                url: `${rlu}+${hasFile ? hasFile : `image/png`}+${id}`
                            }
                            ab.push(ob)
                            setimgF(ab)
                       
                        }
                        GetFiles(src, callBack, len, type)
                    }
                    else {
                        let ulr = `${type === 'github' ? `https://raw.githubusercontent.com/medzyamara` : ``}${src}`
                        let ax = await axios.get(ulr)
                        let b = new Uint8Array(Object.values(ax.data))
                        let bl = new Blob([b], { type: `${hasFile ? hasFile : `image/png`}` })
                        // 
                        let rlu = URL.createObjectURL(bl)
                        setim(rlu)

                        let ab = imgF
                        let ob = {
                            id: id,
                            url: `${rlu}+${hasFile ? hasFile : `image/png`}+${id}`
                        }
                        ab.push(ob)
                        setimgF(ab)

                        // 
                        Obj.addCH([ulr])
                        
                    }
                }
            }
        }
        catch (e) {
            setim(null)
            setrl(uuid())
        }
    };

    useEffect(() => {
        try {
            let N = CImg(id)
            if (!isDEF) {
                getImage(N)
            }
            else {
                GI(N)
            }
        }
        catch {
            toast.error(`Unable to load Image.`)
        }
    }, [rl, ncu, src])

    return (
        <>
            {
                im ?
                    <>
                        {
                            hasFile ? 
                                <>
                                   <iframe onError={e => {setim(null)}} className={className} src={im.split('+')[0]} loading='lazy' frameBorder="0"/>
                                </> : 
                                <img onError={e => {setim(null)}} src={im.split('+')[0]} loading={loading} onLoad={onLoad} className={className} />
                        }
                    </> :
                    <>
                        <div className={`${className} bg-[var(--basebg)] min-w-10 min-h-10 flex items-center justify-center`}>
                            <div className="loading" />
                        </div>
                    </>
            }
        </>
    );
};

export default Img
