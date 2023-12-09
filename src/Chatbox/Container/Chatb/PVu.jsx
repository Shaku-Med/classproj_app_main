import React, { useContext } from 'react'
import { Conn } from '../../../Conn';

let PVu = () => {
    const { setPV, pvT, setpvT } = useContext(Conn);
    console.log(pvT)
    return (
        <div className="iframecontainer relative w-full h-full">
            <div className="closebtinasdf absolute top-[5px] right-[5px] z-[100000000]">
                <i onClick={e => {setpvT(null)}} className="bi bi-x-lg h-10 w-10 flex items-center justify-center cursor-pointer z-[100000] bg-danger brd rounded-md shadow-md" />
            </div>
            <div className="framesaidnas">
                <iframe sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation allow-pointer-lock' src={pvT} className=' w-full h-full absolute top-0 z-[1]'/>
            </div>
        </div>
    )
};

export default PVu
