import React, { useState } from 'react'
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import ATJ from './ATJ';
import MediaSession from './Mediasession';

let Up = ({display, streamdata}) => {
  const [prev, setprev] = useState(null)

  return (
   <div className={` ${streamdata.length > 1 ? 'stdadinad' : ''} streamcontainer overflow-auto h-full w-full p-2`}>
    {
      streamdata.length < 1 ? 
      <>
       <div className="containersad text-center font-bold text-[2rem] flex items-center justify-center h-full w-full p-2">
        Sorry, stream is empty.
       </div>
      </> : 
      streamdata.map((val, key) => { 
        return ( 
        <div key={key} className="dianakestream p-3 bg-[var(--border)] brd shadow-md rounded-md">
          <div className="streamvideoc h-[300px] overflow-hidden">
            <video onLoadedMetadata={e => { 
              let video = document.querySelectorAll('video')
              if(video.length > 0){ 
                video.forEach(v => { 
                  if(v.paused){ 
                    v.play()
                  }
                })
              }
              MediaSession()
            }} controls muted={val.id === localStorage.getItem('id')} autoPlay playsInline className={`id_${val.id} ${val.hasOwnProperty('display') ? val.display ? `` : `vpreinad` : ''} w-full h-full`}></video>
          </div>
          <div className="modalsnaidviews flex items-center justify-between mt-2 gap-2 p-1 rounded-md brd bg-[var(--basebg)]">
            <a target='_blank' href={`https://www.whatismyip.com/search/?s=${val.ip}`} className="ipaddresshere">
              {val.ip}
            </a>
            <div onClick={e => {setprev(val.id)}} className="optionsnowsinad">
              <div className="bi bi-three-dots h-10 w-10 flex items-center justify-center bg-[var(--mainBg)] brd cursor-pointer" />
            </div>
          </div>
          {/*  */}
          {
            val.id === prev ? 
            <ATJ val={val} setprev={setprev}/> : ''
          }
        </div>
        )
      })
    }
   </div>
  );
}

export default Up
