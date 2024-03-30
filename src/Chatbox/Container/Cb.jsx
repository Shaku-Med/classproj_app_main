import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Conn } from '../../Conn';
import Chatb from './Chatb/Chatb';
import ATJ from '../../Home/Page/ATJ';

function Cb() {
  const { issc, setissc, chat, SCRL, scl, messages, setmessages, socket,  setPV, pvT, setpvT, r} = useContext(Conn);
  //  YOU CAN ACTIVATE THE AUTO SCROLL ON THIS PAGE.... IF YOU'D LIKE
  // 
  const [m, setm] = useState([])
  const rf = useRef(null)
  // 
  useLayoutEffect(() => {
    try {
      let reA = []

      function getFormattedDate(timestamp) {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      };

      messages.map(v => {
        const formattedDate = getFormattedDate(v.time);
        const existingGroupIndex = reA.findIndex(group => group.date === formattedDate);
        // 
        if (existingGroupIndex !== -1) {
          reA[existingGroupIndex].data.push(v);
        } else {
          reA.push({ date: formattedDate, data: [v], dt: v.time });
        }
      })
      //
      if (reA.length > 0) { 
        let srt = reA.sort((a, b) => new Date(a.dt) - new Date(b.dt))
        setm(srt)
      }
      else {
        setm([])
      }
      // 
    }
    catch { }
  }, [messages, r]);
  // 
  let Fm = (time, type) => { 
    let d = new Date(time)
    return !type ? `${d.getDay() === new Date().getDay() ? `Today` : d.getDay() === new Date().getDay() - 1 ? 'Yesterday' : d.toDateString()}` : d.toLocaleString()
  }

  let RPLS = (id) => {
    try {
      if (rf.current) {
        let r = rf.current.querySelector(`._id_${id}`)
        r.scrollIntoView({ behavior: 'smooth' })
        // 
        r.classList.add(`showani`)
        setTimeout(() => { 
          r.classList.remove(`showani`)
        }, 5000)
      }
    }
    catch {
      return null
    }
  };


  useLayoutEffect(() => {
    let ch = document.querySelector('.imageinaodkichatbox')
    if (chat && ch) {
      setTimeout(SCRL, 2000)
      // 
      // Assuming `ch` is your scrolling element
      ch.addEventListener('scroll', function (e) {
        let scrollTop = e.target.scrollTop;
        let scrollHeight = e.target.scrollHeight;
        let clientHeight = e.target.clientHeight;

        let distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        let proximityThreshold = 200;

        setissc(distanceToBottom <= proximityThreshold)
      });

    }
  }, [chat]);

  return (
    <div ref={rf} className="imageinaodkichatbox transition-all absolute bottom-0 w-full overflow-auto max-h-full pb-4">
      {
        m.length < 1 ?
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
              m.map((val, key) => {
                return (
                  <div key={key} className="ddBM">
                    <div className="Mba text-center flex items-center justify-center p-2 sticky top-0 left-0 z-[100000000]">
                      <div title={Fm(val.dt, true)} className="yCt bg-[var(--basebg)] p-1 rounded-full shadow-md min-w-[100px] brd backdrop-blur-md">
                        {Fm(val.dt)}
                      </div>
                    </div>
                    <Chatb RPLS={RPLS} isrepl={null} val={val.data} />
                  </div>
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
      <div className="bottomM p-2" />
    </div>
  );
}

export default Cb
