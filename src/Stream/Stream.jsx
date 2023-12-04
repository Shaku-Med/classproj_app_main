import React from 'react'
import { isMobile } from 'react-device-detect';

let Sad = (source, setsource, isstream, setisstream, display, setdisplay, camera, setcamera, mic, setmic, facing, setfacing, stream, setstream, isMobile, Stream, toast, CallBack) => {
    try {
        let sad = {
            getSrc: async () => {
                try {
                    let src = await Stream().getDevices()
                    if (src !== null) {
                        if (src.length > 0) {
                            let array = [
                                {
                                    audio: src.filter(v => v.kind.includes('audioinput'))
                                },
                                {
                                    video: src.filter(v => v.kind.includes('videoinput'))
                                }
                            ]
                            setsource(array)
                        }
                    }
                }
                catch (er) {
                    toast.error(`${isMobile ? `Unable to access some features in your browser` : `Check your browser console to know what's wrong. Click on (CTRL+SHIFT+I OR CTRL+SHIFT+J OR F12)`}`)
                    console.error(er)
                }
            },
            stream: async (audio, video, stop, facingMode, screen) => {
                try {
                    let src = source
                    let active = []
                    src.map((v) => {
                        try {
                            let sort = v[Object.keys(v)[0]].sort((a, b) => new Date(b.hasOwnProperty('time') ? b.time : 0) - new Date(a.hasOwnProperty('time') ? a.time : 0))
                            active.push({
                                type: Object.keys(v)[0],
                                id: sort[0]
                            })
                        }
                        catch {
                            toast.error(`Unable to rearrange the current to present.`)
                        }
                    });
                    if (active.length > 0 || isMobile === true) {
                        let au = isMobile ? null : active[0].type.includes('audio') ? active[0].id.deviceId : active[1].id.deviceId
                        let vu = isMobile ? null : active[1].type.includes('video') ? active[1].id.deviceId : active[0].id.deviceI
                        // 
                        Stream().requestStream(au, vu, facingMode !== undefined && facingMode !== null ? facingMode : 'user', audio !== undefined ? audio : false, video !== undefined ? video : false, stop, stream, setisstream, screen === undefined ? false : screen, setdisplay).then(r => {
                            // 
                            setstream(r)
                            // 
                            setcamera(video !== undefined ? video : false)
                            setmic(audio !== undefined ? audio : false)
                            // 
                            CallBack(r)
                        })
                    }
                }
                catch (er) {
                    toast.error(`${isMobile ? `Unable to access some features in your browser` : `Check your browser console to know what's wrong. Click on (CTRL+SHIFT+I OR CTRL+SHIFT+J OR F12)`}`)
                    console.error(er)
                }
            },
            addsort: (id) => {
                let src = source
                let find = src.find(v => JSON.stringify(v).includes(id))
                if (find) {
                    let ft = find[Object.keys(find)[0]].find(v => v.deviceId === id)
                    if (ft && isstream === true) {
                        ft.time = new Date().getTime()
                        setsource(src)
                        sad.stream(mic, camera, false, facing === null ? 'user' : isMobile ? facing : 'user')
                    }
                }
            },
            addstream: (ist) => {
                if (ist === true) {
                    if (isstream) {
                        sad.stream(false, false, true)
                    }
                    else {
                        sad.stream()
                    }
                }
                else {
                    if (isstream) {
                        if (ist.includes('video')) {
                            sad.stream(mic !== null ? mic : true, camera !== null ? camera === true ? false : true : true, false, facing === null ? 'user' : isMobile ? facing : 'user', false)
                        }
                        else if (ist.includes('screen')) {
                            sad.stream(mic !== null ? mic : true, camera !== null ? camera : true, false, facing === null ? 'user' : isMobile ? facing : 'user', !display ? true : false)
                        }
                        else if (ist.includes('camera')) {
                            let fac = facing === 'user' ? 'environment' : 'user'
                            setfacing(fac)
                            sad.stream(mic !== null ? mic : true, camera !== null ? camera : true, false, facing === null ? 'user' : isMobile ? fac : 'user', display)
                        }
                        else if (ist.includes('audio')) {
                            sad.stream(mic !== null ? mic === true ? false : true : true, camera !== null ? camera : true, false, facing === null ? 'user' : isMobile ? facing : 'user', false)
                        }
                    }
                }
            }
        };
        return sad
    }
    catch {
        return null
    }
};

export default Sad
