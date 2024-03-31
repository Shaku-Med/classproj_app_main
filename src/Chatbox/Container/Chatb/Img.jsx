import axios from 'axios'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {v4 as uuid} from 'uuid'
import { Conn } from '../../../Conn'

let Img = ({ loading, onLoad, className, src, isDEF, type, id, len}) => {
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
                setim(URL.createObjectURL(blob))
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
                        let bl = new Blob([b], { type: `image/png` })
            
                        setim(URL.createObjectURL(bl));
                       
                    }
                    GetFiles(src, callBack, len, type)
                }
                else {
                    let ax = await axios.get(`${type === 'github' ? `https://raw.githubusercontent.com/medzyamara` : ``}${src}`)
                    let b = new Uint8Array(Object.values(ax.data))
                    let bl = new Blob([b], { type: `image/png` })
                    // 
                    setim(URL.createObjectURL(bl))
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
    }, [rl])

    return (
        <>
            {
                im ?
                    <img src={im.split('+')[0]} loading={loading} onLoad={onLoad} className={className} /> :
                    <>
                        <div className={`${className} bg-[var(--basebg)] min-w-10 min-h-10`} />
                    </>
            }
        </>
    );
}

export default Img
