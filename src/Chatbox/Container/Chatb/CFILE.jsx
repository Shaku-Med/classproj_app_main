import React, { useContext } from 'react'
import Img from './Img';
import { Conn } from '../../../Conn';

let CFILE = ({ val }) => {
    const { setPV, pvT, setpvT } = useContext(Conn);

    return (
        <>
            <div className={`fileuploadpathssd ${val.file.length < 1 ? ' pointer-events-none' : `p-2`} transition-all flex overflow-x-auto gap-1 overflow-y-hidden w-full`}>
                {
                    (val.file || []).map((v, key) => {
                        return (
                            <div onClick={e => {
                                setPV(v.hasOwnProperty('tty') ? v.file : v, v.hasOwnProperty('isr'), v.tty, v.type, v.id)
                            }} key={key} className="flexaidna transition-all cursor-pointer hover:brightness-125 max-h-[70px] overflow-hidden flex items-center relative justify-center flex-col max-w-[70px] min-w-[70px] shadow-md p-1 brd rounded-md">
                                {
                                    v.type.includes('image') ?
                                        <div className="aidnkkkaidnkdeaser892 w-full h-full">
                                            <Img id={v.id} type={v.tty} isDEF={v.hasOwnProperty('isr')} loading='lazy' src={v.hasOwnProperty('tty') ? v.file : v} className={` w-full object-cover object-top h-full rounded-md brd shadow-md overflow-hidden`} />
                                        </div> :
                                        <i className={`bi bi-file-earmark text-[1.3rem]`} />
                                }
                                <div title={v.name} className={`filename line-clamp-1 text-center ${v.type.includes('image') ? `absolute bottom-[5px] left-0 w-full max-w-[80px]` : ` w-full`}`}>
                                    {v.name}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
};

export default CFILE
