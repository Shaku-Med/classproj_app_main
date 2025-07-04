import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { toast } from 'react-toastify'
import Sad from '../../Stream/Stream'
import Stream from '../../Stream/Str'
import Up from './Up'
import {v4 as uuid} from 'uuid'
import { Conn } from '../../Conn'
import * as Device from 'react-device-detect'

let Down = () => {

  const { dif, setPEER, display, setdisplay, addST, peerRef, socket, chat, setchat, streamdata, setstreamdata, JOIND} = useContext(Conn);

  const [source, setsource] = useState([])
  const [isstream, setisstream] = useState(false)
  // 
  const [camera, setcamera] = useState(null)
  const [mic, setmic] = useState(null)
  const [facing, setfacing] = useState('user')
  const [stream, setstream] = useState(null)

  const [joined, setjoined] = useState(false)

    // Streams USERS & ME
    const [rl, setrl] = useState(0)


    let CallBack = (r) => {
        if(streamdata.length < 1){ 
            setstreamdata([
                { 
                    id: `${localStorage.getItem('id')}`,
                    state: 'offline'
                }
            ])
        }
        // 
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
                display: display,
            }
        };

        if (joined === true) { 
            socket.emit('join', dif(`${localStorage.getItem('id')}`))
        }

        if(peerRef.current !== null){ 
            peerRef.current.destroy()
        }
        
        setPEER(addST, null, r, dif)
    
        //

        JOIND(r)

        // socket.on('joined', (d) => {
        //     if (d) {
        //         let data = d.data
        //         if (data.length > 0) {
        //             let filter = data.filter(v => v.id !== `${localStorage.getItem('id')}`)
        //             if (filter !== undefined && filter.length > 0) {
        //                 setstreamdata(data)
        //                 // 
                        
        //             }
        //         }
        //     }
        // });

        //

    };


    let NPP = () => {
        setPEER(null, true, null, dif)
        // 

        peerRef.current.on('call', (call) => {
            call.answer(null)
            call.on('stream', (vidstream) => {
                addST(vidstream, call.peer, null, display)
            })
        })

        JOIND()
    };

    let heartBeat = () => { 
        setInterval(() => { 
            if(isstream){ 
                socket.emit(`HeartBeat`, `Bombpp`)
                if(socket.connected === false){ 
                    Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream(true)
                    socket.connect()
                }
            }
            else { 
                socket.emit(`HeartBeat`, `Bombpp`)
                if(socket.connected === false){
                    NPP()
                    socket.connect()
                } 
            }
        }, 3 * 2000)
    }

    const [h, seth] = useState(0)

    useEffect(() => {
        try {
            NPP()
            heartBeat()

            // socket.on('connect', () => {
            //     if (isstream) {
            //         Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream(true)
            //     }
            //     else {
            //         NPP()
            //         heartBeat()
            //     }
            // });

            // socket.on('disconnect', () => {
            //     socket.connect()
            //     if (isstream) {
            //         Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream(true)
            //     }
            //     else {
            //         NPP()
            //         heartBeat()
            //     }
            // });
        }
        catch (e) {
            // if (isstream) {
            //     Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).addstream(true)
            // }
            // else {
            //     NPP()
            //     heartBeat()
            // }
        }
    }, [streamdata]);

    useEffect(() => {
        try {
            if (!isMobile) {
                Sad(source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack).getSrc()
            }
        }
        catch {
            toast.info(`Something's wrong. \t \n Please check your browser's access to your camera & audio setting`)
        }
    }, []);


    return (
        <div className=' videoviewpartsetup w-full h-full overflow-hidden flex items-center justify-between flex-col'>
            <Up display={display} />
            <div className="streamercontrolsaidnfoas pb-4 w-full p-4 flex items-center justify-center">
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

                    <div onClick={e => {
                        let ct = chat ? false : true
                        setchat(ct);
                        localStorage.setItem('chat', ct)
                    }} className={`leftpartsaidna ${chat ? `bg-danger` : `bg-success`} cursor-pointer active:scale-[.90] transition-all join-item brd w-full items-center justify-center flex p-1`}>
                        <i className={`bi ${chat ? `bi-chat-square-text` : `bi-chat-square`}`} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Down
