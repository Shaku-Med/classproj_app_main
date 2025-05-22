import React, { useContext } from 'react'
import Img from './Img';
import { Conn } from '../../../Conn';
import CryptoJS from 'crypto-js';
import {motion} from 'framer-motion'
// 
let CFILE = ({ val, filtME }) => {
    const { aniid, setaniid, setPV, pvT, setpvT, users, owner, chid } = useContext(Conn);

    return (
        <>
            <div className={`fileuploadpathssd ${val.file.length < 1 ? ' pointer-events-none' : `p-2`} transition-all flex overflow-x-auto gap-1 overflow-y-hidden w-full`}>
                {
                    (filtME(val.file, val.time, true) || []).map((v, key) => {
                        if (typeof v === 'object') {
                            return (
                                <motion.div layoutId={v.id} onClick={e => {
                                    setPV(v.hasOwnProperty('tty') ? v.file : v.file, v.hasOwnProperty('isr'), v.tty, v.type, v.id, v.hasOwnProperty('fileLength') ? v.fileLength : null)
                                    setaniid(v.id)
                                }} key={key} className="flexaidna transition-all cursor-pointer hover:brightness-125 overflow-hidden flex items-center relative justify-center flex-col shadow-md p-1 brd rounded-md min-w-[70px] w-full max-h-[200px]">
                                    {
                                        v.type.includes('image') ?
                                            <div className="aidnkkkaidnkdeaser892 w-full h-full">
                                                {/* v.hasOwnProperty('isr') isDEF */}
                                                <Img hasFile={v.hasOwnProperty('type') ? v.type.includes('image') ? null : true : null} len={v.hasOwnProperty('fileLength') ? v.fileLength : null} id={v.id} type={v.tty} isDEF={true} loading='lazy' src={v.hasOwnProperty('tty') ? v.file : v.file} className={` w-full object-cover object-top h-full rounded-md brd shadow-md overflow-hidden`} />
                                            </div> :
                                            <i className={`bi bi-file-earmark text-[1.3rem]`} />
                                    }
                                    <div title={v.name} className={`filename line-clamp-1 text-center ${v.type.includes('image') ? `absolute bottom-[5px] left-0 w-full max-w-[80px]` : ` w-full`}`}>
                                        {v.name}
                                    </div>
                                </motion.div>
                            );
                        }
                        else {
                            return ''
                        }
                    })
                }
            </div>
        </>
    );
};

export default CFILE
