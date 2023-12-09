import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import PVu from '../../Chatbox/Container/Chatb/PVu';
import { useContext, useState } from 'react';
import { Conn } from '../../Conn';

let ATJ = ({ val, setprev, isprev }) => {   
    return ( 
      <>
        {isprev ? 
          <>
            <PVu/>
          </> : 
          <div className="aidnkikeaidfviewsnow flex items-center justify-between flex-col fixed top-0 left-0 w-full h-full z-[10000000000000] bg-[var(--basebg)] backdrop-blur-md">
          <div className="modalsnaidviews w-full flex items-center justify-between gap-2 p-1 brd bg-[var(--basebg)]">
            <div className="ipaddresshere">
              Attack Info
            </div>
            <div onClick={e => {setprev(null)}} className="optionsnowsinad">
              <div className="bi bi-x-lg h-10 w-10 flex items-center justify-center bg-[var(--mainBg)] brd cursor-pointer" />
            </div>
          </div>
           <div className="jsoncontainersasd overflow-auto h-full w-full">
           <JsonView data={val} shouldExpandNode={allExpanded} style={defaultStyles} />
           </div>
          </div>
        }
      </>
    )
}

export default ATJ