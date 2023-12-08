import React, { useContext, useState } from 'react'
import { Conn } from '../Conn'
import Container from './Container/Container';

let Chatbox = () => {
    const {chat, setchat} = useContext(Conn);

  return (
    <div className={`${chat ? `w-full max-w-[400px] max-[780px]:max-w-full transition-all aidnlkaindkeis h-full bg-[var(--basebg)] max-[780px]:max-h-[50%] opacity-1` : ` max-[780px]:h-0 max-[780px]:w-full w-0 opacity-0 pointer-events-none`} transition-all`}>
        {
            chat ? 
            <Container/> : ''
        }
    </div>
  )
}

export default Chatbox