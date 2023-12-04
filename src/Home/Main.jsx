import React from 'react'
import Up from './Page/Up'
import Down from './Page/Down'

let Main = () => {
    return (
        <div className="updowndataset overflow-hidden flex items-start justify-between fixed top-0 left-0 w-full h-full flex-col">
            <Down />
        </div>
    );
}

export default Main
