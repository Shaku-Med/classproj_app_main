import React from 'react'
import Up from './Page/Up'
import Down from './Page/Down'
import Chatbox from '../Chatbox/Chatbox';

let Main = () => {
    return (
        <div className="updowndataset overflow-hidden flex items-start justify-between fixed top-0 left-0 w-full h-full max-[780px]:flex-col">
            <Down />
            <Chatbox/>
        </div>
    );
}

export default Main
