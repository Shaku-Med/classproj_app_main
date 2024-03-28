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
                    <div className="conTTime min-h-[5px] w-full bg-[var(--basebg)] fixed top-0 left-0 z-[10000]">
                        <div style={{width: `${progress}%`}} className="pbar h-full w-0 bg-danger transition-all" />
                    </div> : ``
            }
        </div>
    );
}

export default Main
