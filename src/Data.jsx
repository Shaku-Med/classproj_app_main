import React, { useContext, useLayoutEffect } from 'react'
import { Conn } from './Conn';
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import Obj from './Obj';
import CryptoJS from 'crypto-js';
// 
let Data = ({rl, setrl, addUsr}) => {
    const { k, users, setusers, owner, setcrl, store, setstore } = useContext(Conn);
    
    let getPMesages = async (dc) => { 
        try {
             let date = new Date()
            let ob = {
                exp: date.setSeconds(date.getSeconds() + 20),
            }
            let ax = await axios.post(`https://clpb.onrender.com/private/ms/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid') })
            if (ax.data.success.length > 0) {
                let d = JSON.parse(CryptoJS.AES.decrypt(ax.data.success[0], k.m).toString(CryptoJS.enc.Utf8))
                if (d) {
                    let contacts = owner[0].contacts.flatMap(v => {
                        let contactinfo = []
                        v.enck.map(m => { 
                            let f = d.find(a => a.id === m.k)
                            if (f) {
                                let obj = {
                                    phone: v.phone,
                                    message: f.messages.messages
                                }
                                contactinfo.push(obj)
                            }
                        })

                        return contactinfo
                    })
                    if (contacts.length > 0) {
                        contacts.map(v => {
                            let u = dc
                            let f = u.find(a => a.phone === v.phone)
                            if (f) {
                                f.messages = v.message
                                // addUsr(u)
                                setusers(u)
                            }
                            else {
                                setusers(dc)
                            }
                        })
                    }
                    else {
                        setusers(dc)
                    }
                }
            }
        }
        catch (e) {
            setTimeout(getPMesages, 2000);
        }
    }

     let getstore = async () => {
        try {
            let date = new Date()
            let ob = {
                exp: date.setSeconds(date.getSeconds() + 20),
            }
            let ax = await axios.post(`https://clpb.onrender.com/private/storage/get`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid') })
            let d = ax.data
            if (d) {
                let m = JSON.parse(CryptoJS.AES.decrypt(d, k.m).toString(CryptoJS.enc.Utf8))
                setstore(m)
            }
            else {
                setstore([])
            }
        }
        catch {
        }
    };

    let getUsers = async () => {
        try {
            let date = new Date()
            let ob = {
                exp: date.setSeconds(date.getSeconds() + 20),
            }
            let ax = await axios.post(`https://clpb.onrender.com/private/gu/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid') })
            let d = ax.data.data
            if (d) {
                let dc = JSON.parse(Obj.encDec(d, k.p, true))
                // 
                getPMesages(dc)
                getstore()
            }
            else {
                setusers(false)
            }
        }
        catch {
            setTimeout(getUsers, 2000)
        }
    };
    // 
    useLayoutEffect(() => {
        try {
            if (owner.length > 0) {
                getUsers();
            }
        }
        catch {
            return null
        }
    }, [k]);
}

export default Data
