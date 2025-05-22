import React from 'react'
import Obj from '../Obj'

let isAuth = (name, k, data) => {
    try {
        let t = Obj.encDec(localStorage.getItem(name), `${k}+${window.navigator.userAgent.split(/\s+/).join('')}`, true)
        if (t) {
            let em = data ? JSON.parse(t) : JSON.parse(t).match(/[A-Za-z0-9._%+-]+@gmail\.com/)
            if (em) {
               return em
            }
            else {
                return null
            }
        }
        else {
            return null
        }
    }
    catch {
        return null
    }
}

export default isAuth
