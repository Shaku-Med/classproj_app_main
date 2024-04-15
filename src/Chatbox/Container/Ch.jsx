import React, { useContext } from 'react'
import { Conn } from '../../Conn';

function Ch() {
   const { state_p, setstate_p, pdata, setpdata, setchid } = useContext(Conn);
   // 
   return (
      <>
         <div className="aidnlkkeaindeade text-center p-2 w-full uppercase font-bold bg-[var(--basebg)]">
            {state_p === true || state_p === 'true' ? <div><span className="maks text-success"><i className="bi bi-lock" /> Private</span> Live Chat</div> : <div><span className="maks text-danger"><i className="bi bi-unlock" />Public</span> Live Chat</div>}
         </div>
         {
            state_p === true || state_p === 'true' ?
               <div className={`storageS brd bg-[var(--mainBg)] flex items-center justify-center w-full`}>
                  <div onClick={e => {
                     setpdata(false);
                  }} className={`btianksi hover:bg-[var(--basebg)] ${!pdata ? `bg-[var(--border)] brd` : ``} w-full flex items-center justify-center gap-1 p-1`}>
                     Chats
                  </div>
                  <div onClick={e => {
                     setpdata(true)
                  }} className={`btianksi hover:bg-[var(--basebg)] ${pdata ? `bg-[var(--border)]` : ``} w-full flex items-center justify-center gap-1 p-1`}>
                     Private Storage
                  </div>
               </div> : ``
         }
      </>
   );
}

export default Ch