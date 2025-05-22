import React from 'react'

let getDev = () => {
    try {
        let wd = window.location.origin
        if (wd.includes(`https://clp-one.vercel.app`)) {
            return window.navigator.userAgent.split(/\s+/).join('')
        }
        else {
            return null
        }
    }
    catch {
        return null
    }
};

export default getDev
