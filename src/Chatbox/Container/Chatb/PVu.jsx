import React, { useContext, useState } from 'react'
import { Conn } from '../../../Conn';
import Img from './Img';
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify';
// 
let PVu = () => {
    const { setPV, pvT, setpvT } = useContext(Conn);
    const [d, setd] = useState(false)
    // 
    let download = () => {
        try {
            // 
            setd(true)
            setTimeout(() => {
                // 
                let a = document.createElement('a')
                a.href = pvT.split('+')[0]
                a.download = `clp_Download_${uuid().split('-').join('').toUpperCase()}`
                a.click()
                // 
                setd(false)
            }, 1000)
        }
        catch {
            toast.error(`Unable to request download`)
            setd(false)
        }
    };
    // 
    return (
        <div className=" fixed top-0 left-0 w-full h-full z-[100000000000000000]">
            <div className="closebtinasdf flex items-center justify-end gap-1 absolute top-[5px] right-[5px] z-[100000000]">
                <button disabled={d} onClick={d ? e => { } : download} className="saveBTn transition-all opacity-[.4] hover:opacity-[1] flex items-center justify-center h-full rounded-xl brd hover:shadow-xl cursor-pointer btn gap-1 uppercase">
                    {
                        d ?
                            <>
                                <i className="loading" />
                            </> :
                            <>
                                <i className="bi bi-save" />
                                <span>download</span>
                            </>
                    }
                </button>
                <i onClick={e => { setpvT(null) }} className="bi opacity-[.4] hover:opacity-[1] transition-all bi-x-lg btn h-10 w-10 flex items-center justify-center cursor-pointer z-[100000] brd rounded-md shadow-md" />
            </div>
            <div className="framesaidnas w-full h-full">
                {
                    pvT ?
                        pvT.includes('image') ?
                            <div className="conTains flex items-center justify-center w-full h-full">
                                <Img id={pvT.split('+')[2]} isDEF={true} src={pvT.split('+')[0]} className=' w-full h-full object-contain' />
                            </div>
                            :
                            <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation allow-pointer-lock' src={pvT.split('+')[0]} className=' w-full h-full absolute top-0 z-[1]' /> : `NOTHING FOUND`
                }
            </div>
        </div>
    );
};

export default PVu
