import React, { useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

let Img = ({ loading, onLoad, className, src }) => {
    
    const ref = useRef(null)

    let getImage = async () => {
        try {
            if (ref && ref.current !== null) {
                let sc = src.file
                let blob = new Blob([sc], { type: src.type })
                ref.current.src = URL.createObjectURL(blob)
            }
        }
        catch {
            toast.error(`Unable to load Image.`)
        }
    };

    useLayoutEffect(() => { 
        try { 
            getImage()
        }
        catch { 
            toast.error(`Unable to load Image.`)
        }
    }, [])

    return ( 
        <img ref={ref} loading={loading} onLoad={onLoad} className={className} />
  )
}

export default Img
