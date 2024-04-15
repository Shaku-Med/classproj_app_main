import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Conn } from '../Conn'
import Container from './Container/Container';
import { v4 as uuid } from 'uuid'
// 
let Chatbox = () => {
  const {setr, chat, setchat, messages, setmessages, lk, setlk, SUB, r, progress} = useContext(Conn);
  // 
  useLayoutEffect(() => {
    try {
      if (messages.length === 0 && lk.length > 0) {
        let m = messages
        m.push.apply(m, lk);
        // // 
        setmessages(m);
        setlk([]);
        setr(uuid())
      }
      else {
        if (lk.length > 0) {
          let m = messages;
          let f = m.find(v => lk.some(a => a.id === v.id))
          if (!f) {
            m.push.apply(m, lk);
            // // 
            setmessages(m);
            setlk([]);
            setr(uuid())
          }
        }
      }
    } catch { }
  }, [lk, messages]);
  //
  // 
  useLayoutEffect(() => { 
    let st = localStorage.getItem('chat')
    setchat(st === 'true' ? st : null)
  }, [])
  // 
  return (
    <div className={`${chat ? `w-full max-w-[400px] max-[780px]:max-w-full transition-all aidnlkaindkeis h-full bg-[var(--basebg)] max-[780px]:min-h-[70%] opacity-1` : ` max-[780px]:h-0 max-[780px]:w-full w-0 opacity-0 pointer-events-none`} transition-all`}>
      {
        chat ?
          <Container /> : ''
      }
      {
        progress ?
          <div className="conTTime min-h-[5px] w-full bg-[var(--basebg)]">
            <div style={{ width: `${progress}%` }} className="pbar h-full w-0 bg-danger transition-all" />
          </div> : ``
      }
    </div>
  );
}

export default Chatbox