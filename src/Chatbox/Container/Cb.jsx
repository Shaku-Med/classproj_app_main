import React, { useContext } from 'react'
import { Conn } from '../../Conn';
import Chatb from './Chatb/Chatb';
import ATJ from '../../Home/Page/ATJ';

function Cb() {
  const { messages, setmessages, socket,  setPV, pvT, setpvT} = useContext(Conn);
  //  YOU CAN ACTIVATE THE AUTO SCROLL ON THIS PAGE.... IF YOU'D LIKE
  return (
    <div className="imageinaodkichatbox transition-all absolute bottom-0 w-full overflow-auto max-h-full pb-4 pt-2">
      {
        messages.length < 1 ?
          <>
            <div className="inaindineaidneades flex-col gap-1 text-center uppercase opacity-[.6] h-full flex items-center w-full justify-center text-xl">
              No Message Yet
              <div className="smalltext text-xs">
                Be the first
              </div>
            </div>
          </> :
          <>
            {
              messages.map((val, key) => {
                return (
                  <Chatb isrepl={null} key={key} val={val} />
                )
              })
            }

            {
              pvT !== null ?
                <div className="modalsiandpinchloandhigh fixed top-0 left-0 w-full h-full backdrop-blur-md z-[100000000]">
                  <ATJ isprev={true} />
                </div> : ''
            }
          </>
      }
    </div>
  );
}

export default Cb