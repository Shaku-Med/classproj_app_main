import React, { useContext, useState } from 'react'
import Ch from './Ch'
import Cb from './Cb'
import Cf from './Cf'
import { Conn } from '../../Conn'
import Private from '../../Private/Private'
import isAuth from '../../Alert/isAuth'

function Container() {
  const { state_p, setstate_p, k, pchatid, pdata, setchid} = useContext(Conn);
  // 
  return (
    <div className={`containerbox flex items-start justify-between flex-col h-full overflow-hidden`}>
      <div className={`chatH flex items-center justify-center gap-2 w-full p-2`}>
        <div onClick={e => {
          setstate_p(false)
          setchid(null)
          localStorage.setItem('isPrivate', false)
        }} className={`buttonAct hover:bg-[var(--border)] cursor-pointer flex items-center justify-center ${state_p === null || state_p === false || state_p === 'false' ? `bg-[var(--basebg)]` : `opacity-[.4] bg-[var(--mainBg)]`} p-1 brd rounded-md shadow-md w-full`}>
          Public
        </div>
        <div className="devBtn w-full flex items-center justify-center gap-1">
          <div onClick={e => {
            setstate_p(true)
            setchid(null)
            localStorage.setItem('isPrivate', true)
          }} className={`buttonAct hover:bg-[var(--border)] cursor-pointer flex items-center justify-center ${state_p === true || state_p === 'true' ? `bg-[var(--basebg)]` : `opacity-[.4] bg-[var(--mainBg)]`} p-1 brd rounded-md shadow-md w-full`}>
            Private
          </div>
          {
            isAuth('userid', k.u) ?
              <div onClick={e => {
                if (window.confirm(`You'll signin back to access your account\n\n click on (Ok) to continue or (Cancle) to ignore.`)) {
                  localStorage.clear()
                  window.location.reload()
                }
              }} className="logOUts flex items-center justify-center p-1 brd rounded-md shadow-md text-danger cursor-pointer hover:scale-[1.1] hover:text-white transition-all">
                SignOut
              </div> : ``
          }
        </div>
      </div>
      <Ch />
      <div className={`containdinchatboxs relative h-full w-full`}>
        {
          state_p === true || state_p === 'true' ?
            <Private /> :
            <Cb />
        }
      </div>
      {
        state_p === true || state_p === 'true' ?
          isAuth(`userid`, k.u) ?
            <>
              {
                pchatid && pdata ? 
                  <Cf /> : ``
              }
            </> : `` :
          <Cf />
      }
    </div>
  );
}

export default Container