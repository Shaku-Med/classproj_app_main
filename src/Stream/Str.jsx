import React from 'react'
import { toast } from 'react-toastify'
import { isMobile } from 'react-device-detect'

let Stream = () => {
    // 
    let MediaStreamHelper = {
        _stream: null,
        getDevices: async (audioSource, videoSource, facingMode) => {
            try { 
                return await window.navigator.mediaDevices.enumerateDevices()
            }
            catch { 
                toast.error(`Unable to access device sound OUTPUT and INPUTS. Check your browser settings and try again.`)
                return null
            }
        },
        requestStream: async (audioSource, videoSource, facingMode, audiomuted, videomuted, stop, MediaStreamHelper, setisstream, screen, setdisplay) => {
            try {
                if (MediaStreamHelper) {
                    MediaStreamHelper.getTracks().forEach(track => {
                        track.stop()
                    })
                }
                const constraints = {
                    audio: audiomuted === true ? !videomuted ? false : true : isMobile ? true : {
                        deviceId: audioSource ? { exact: audioSource } : undefined,
                        mute: audiomuted
                    },
                    video: videomuted === true ? !audiomuted ? false : true : isMobile ?  facingMode !== undefined && facingMode !== 'user' ? {
                        facingMode: { exact: facingMode },
                    } : true : {
                        deviceId: videoSource ? { exact: videoSource } : undefined,
                        facingMode: { exact: facingMode },
                        mute: videomuted
                    }
                };
                // 
                let displayCons = { 
                    audio: true,
                    video: true
                }
                // 
                setisstream(stop ? false : true)
                setdisplay(stop ? false : screen)
                // 
                return stop ? null : screen === true ? window.navigator.mediaDevices.getDisplayMedia(displayCons) : window.navigator.mediaDevices.getUserMedia(constraints)
            }
            catch {
                toast.error(`Something went wrong. Please check your browsers camera and audio access settings and try again.`)
                return null
            }
        }
    }
    return MediaStreamHelper
}

export default Stream
