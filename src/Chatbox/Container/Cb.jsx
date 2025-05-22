import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Conn } from '../../Conn';
import Chatb from './Chatb/Chatb';
import ATJ from '../../Home/Page/ATJ';
import { motion, AnimatePresence } from 'framer-motion';

function Cb({msga}) {
  const { chid, crl, users, scp, setscp, issc, setissc, chat, SCRL, scl, messages, setmessages, socket,  setPV, pvT, setpvT, r} = useContext(Conn);
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

      let mg = msga ? msga : messages
      mg.map(v => {
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
        let srt = reA.sort((a, b) => new Date(b.dt) - new Date(a.dt))
        setm(srt.reverse())
      }
      else {
        setm([])
      }
      // 
    }
    catch { }
  }, [messages, r, msga, users, crl, chid]);
  // 
  let Fm = (time, type) => {
    let d = new Date(time);
    if (!type) {
      let today = new Date();
      if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        return 'Today';
      } else if (d.getDate() === today.getDate() - 1 && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        return 'Yesterday';
      } else {
        return d.toDateString();
      }
    } else {
      return d.toLocaleString();
    }
  };


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
    let s = scp
    let flt = s.find(v => v.id === 'public')
    // 
    if (chat && ch && !flt) {
      setTimeout(SCRL, 1000)
      // 
      // Assuming `ch` is your scrolling element
      ch.addEventListener('scroll', function (e) {
        let scrollTop = e.target.scrollTop;
        let scrollHeight = e.target.scrollHeight;
        let clientHeight = e.target.clientHeight;

        let distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        let proximityThreshold = 200;

        setissc(distanceToBottom <= proximityThreshold)

        //

        let ob = {
          id: 'public',
          sp: scrollTop
        }

        let f = s.find(v => v.id === 'public')
        if (f) {
          f.sp = scrollTop
          setscp(s)
        }
        else {
          s.push(ob)
          setscp(s)
        }
      });

    }
    else if (chat && ch && flt) {
      setTimeout(() => {
        ch.scrollTo(0, flt.sp)
        // 
        ch.addEventListener('scroll', e => {

          let scrollTop = e.target.scrollTop;

          let ob = {
            id: 'public',
            sp: scrollTop
          }

          let f = s.find(v => v.id === 'public')
          if (f) {
            f.sp = scrollTop
            setscp(s)
          }
          else {
            s.push(ob)
            setscp(s)
          }

        })
      }, 200)
    }
  }, [chat]);

  const [ads, setads] = useState(null)

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
          </>
      }
      <div className="bottomM p-2" />
    </div>
  );
}

export default Cb
