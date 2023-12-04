import React, { useContext, useLayoutEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { toast } from 'react-toastify'
import Sad from '../../Stream/Stream'
import Stream from '../../Stream/Str'
import Up from './Up'
import {v4 as uuid} from 'uuid'
import { Conn } from '../../Conn'
import Peer from 'peerjs'
import * as Device from 'react-device-detect'

let Down = () => {

    const { peerRef, socket} = useContext(Conn);

  const [source, setsource] = useState([])
  const [isstream, setisstream] = useState(false)
  const [display, setdisplay] = useState(false)
  // 
  const [camera, setcamera] = useState(null)
  const [mic, setmic] = useState(null)
  const [facing, setfacing] = useState('user')
    const [stream, setstream] = useState(null)

    const [joined, setjoined] = useState(false)

    let addST = (r, id, data, display) => {
        // 
        let streamcontainer = document.querySelector('.streamcontainer')
        if (streamcontainer !== null) {
            // 
            let div = document.createElement('div')
            let video = document.createElement('video')
            // 
            video.setAttribute(`class`, `${display ? '' : 'vpreinad'} transition-all bg-[var(--mainBg)] w-full h-full swap-rotate`)
            // 
            div.setAttribute(`class`, `videogridflexsiznied id_${id}   overflow-hidden rounded-lg backdrop-blur-sm shadow-md brd h-full`)
            // 
            video.autoplay = true
            // 
            video.srcObject = r
            // 
            // 
            let getid = streamcontainer.querySelector(`.id_${id}`)
            // 
            if (getid !== null) {
                streamcontainer.removeChild(getid)

                video.onloadedmetadata = () => {
                    div.appendChild(video)
                    streamcontainer.appendChild(div)
                }
            }
            else {
                video.onloadedmetadata = () => {
                    div.appendChild(video)
                    streamcontainer.appendChild(div)
                }
            }
            // 
        }
    };

    let CallBack = (r) => {
        addST(r, `${localStorage.getItem('id')}`, [], display)

        let dif = (id) => {
            return {
                id: id,
                device: Device,
                width: window.innerWidth,
                height: window.innerHeight,
                useragent: window.navigator.userAgent,
                languages: window.navigator.languages,
                outerHeight: window.outerHeight,
                outerWidth: window.outerWidth,
                time: new Date().getTime(),
            }
        };

        if (joined === true) { 
            socket.emit('join', dif(`${localStorage.getItem('id')}`))
        }
        
        // Perform Connection
        peerRef.current = new Peer(`${localStorage.getItem('id')}`, {
            host: `localhost`,
            port: 3002,
            path: `/stream`,
        })

        // Connect Check 
        peerRef.current.on('open', (id) => {
            socket.emit('join', dif(id))
        })

        peerRef.current.on('call', (call) => { 
            call.answer(r)
            call.on('stream', (vidstream) => { 
                 addST(vidstream, call.peer, null, display)
            })
        })

        //

        socket.on('joined', (data) => {
            setjoined(true)
            // 
            if (data.length > 0){ 
                let filter = data.filter(v => v.id !== `${localStorage.getItem('id')}`)
                if (filter !== undefined && filter.length > 0) { 
                    data.map((v) => { 
                        let call = peerRef.current.call(`${v.id}`, r)
                        if (call !== undefined) { 
                            call.on('stream', (vidstream) => { 
                                addST(vidstream, call.peer, v, display)
                            })
                        }
                    })
                }
            }
        })

        //

    };

  useLayoutEffect(() => { 
    try { 
      if (!isMobile) { 
        Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).getSrc()
      }
    }
    catch { 
      toast.info(`Something's wrong. \t \n Please check your browser's access to your camera & audio setting`)
    }
  }, [])

    return (
        <div className=' videoviewpartsetup w-full h-full overflow-hidden flex items-center justify-between flex-col'>
            <Up display={display} />
            <div className="streamercontrolsaidnfoas w-full p-2 flex items-center justify-center">
                <div className="controlscenterilizers max-w-[1000px] join gap-1 flex items-center justify-evenly p-2 bg-[var(--border)] rounded-md shadow-md backdrop-blur-md brd w-full">
                    {
                        isMobile ? '' :
                            <div className="leftpartsaidna bg-[var(--basebg)]  cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1">
                                <select onChange={e => Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addsort(e.target.value)} className="aidnkkeiandieseeeda form-input  bg-[var(--basebg)] w-full rounded-md brd shadow-md ">
                                    {
                                        source.length < 1 ? '' :
                                            source.map((val, key) => {
                                                return (
                                                    <optgroup className=' bg-[var(--basebg)]' label={Object.keys(val)[0]} key={key}>
                                                        {
                                                            val[Object.keys(val)[0]].length < 1 ? '' :
                                                                val[Object.keys(val)[0]].map((v, k) => {
                                                                    return (
                                                                        <option value={v.deviceId} key={k} className="ditemshere text-sm  bg-[var(--border)] break-before-all text-[var(--mainCl)]">
                                                                            {v.label}
                                                                        </option>
                                                                    );
                                                                })
                                                        }
                                                    </optgroup>
                                                );
                                            })
                                    }
                                </select>
                            </div>
                    }
                    <div onClick={e => {
                        Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream(true)
                    }} className={`leftpartsaidna gap-1 uppercase cursor-pointer active:scale-[.90] transition-all ${isstream ? `bg-danger` : `bg-primary`} join-item brd w-full items-center justify-center flex p-1`}>
                        <i className={`bi ${isstream ? `bi-stop-circle` : `bi-camera-reels`}`} />
                        {isstream ? '' : <span className=' text-sm max-[600px]:hidden flex'>Start</span>}
                    </div>
                    <div onClick={e => {
                        if (!mic) {
                            Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream('video')
                        }
                    }} className={`leftpartsaidna ${camera ? `bg-danger` : `bg-success`} cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1`}>
                        <i className={`bi ${camera ? `bi-camera-video-off` : `bi-camera-video`}`} />
                    </div>
                    <div onClick={e => {
                        if (!camera) {
                            Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream('audio')
                        }
                    }} className={`leftpartsaidna ${mic ? `bg-danger` : `bg-success`} cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1`}>
                        <i className={`bi ${mic ? `bi-mic-mute` : `bi-mic`}`} />
                    </div>
                    {
                        !isMobile ?
                            <div onClick={e => {
                                Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream('screen')
                            }} className={`leftpartsaidna ${display ? `bg-danger` : `bg-success`} cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1`}>
                                <i className={`bi ${display ? `bi-projector-fill` : `bi-projector`}`} />
                            </div> : ''
                    }
                    {
                        isMobile ?
                            <div onClick={e => {
                                Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream('camera')
                            }} className={`leftpartsaidna ${facing === 'environment' ? `bg-danger` : `bg-success`} cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1`}>
                                <i className={`bi ${facing === 'environment' ? `bi-phone` : `bi-phone-flip`}`} />
                            </div> : ''
                    }
                </div>
            </div>
        </div>
    );
}

export default Down
