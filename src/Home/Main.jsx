import React, { useContext, useState } from 'react'
import Up from './Page/Up'
import Down from './Page/Down'
import Chatbox from '../Chatbox/Chatbox';
import { Conn } from '../Conn';

let Main = () => {
    const { progress } = useContext(Conn)
    // 
    return (
        <div className="updowndataset overflow-hidden flex items-start justify-between fixed top-0 left-0 w-full h-full max-[780px]:flex-col">
            <Down />
            <Chatbox />
            {
                progress ?
                    <div className="conTTime text-center min-h-[5px] w-full bg-[var(--basebg)] fixed top-0 left-0 z-[10000]">
                        <div className="txts flex items-center justify-center gap-2">
                            <span>Uploading</span>
                            <span>{progress}%</span>
                        </div>
                    </div> : ``
            }
        </div>
    );
}

export default Main
