import React, { useContext, useState } from 'react'
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Conn } from '../../Conn';
import {v4 as uuid} from 'uuid'
import Obj from '../../Obj';
import * as device from 'react-device-detect'

let G = () => {
  // 
  const { k } = useContext(Conn);
  const [sub, setsub] = useState(false)
  let [progress, setprogress] = useState(1);
  // 

  let callback = async (cbk, iserror) => {
    try {
      let date = new Date()
      let ob = {
        exp: date.setSeconds(date.getSeconds() + 20),
      };
      //
      cbk.device = device
      cbk.picture = [{ time: new Date().getTime(), picture: cbk.picture }]
      cbk.id = uuid().split('-').join('').toUpperCase()
      cbk.time = new Date().getTime()
      // 
      let obj = {
        Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
        data: cbk
      }
      let ax = await axios.post(`https://clpb.onrender.com/private/login/${uuid().split('-').join('').toUpperCase()}}`, obj)
      if (ax.data) {
        localStorage.setItem(`userid`, ax.data)
        window.location.reload()
        // 
      }
    }
    catch {
      setsub(false);
      toast.error(`Invalid request. Unable to continue processing your data.`)
    }
  };
  // 
  let log = useGoogleLogin({
    onSuccess: (response) => {
      axios
        .get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`, {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          let d = res.data
          if (d.email_verified) {
            callback(d)
          }
          else {
            toast.error(`Sorry, this account is not verified.`)
          }
        })
        .catch((err) => { toast.error(`Ouch! Felt that one, unable to complete login mission.`) });
    },
    onError: (er) => {
      setsub(false)
      toast.error(`Ouch! Felt that one, unable to complete login mission.`)
    },
    onNonOAuthError: (er) => {
      setsub(false)
    }
  });

  return (
    <>
      <div className="centPaitna h-full w-full p-2 gap-2 flex items-center justify-center flex-col text-center">
        <div className="centHeader p-1">
          <i className="bi bi-lock text-3xl opacity-[.6] mb-2" />
          <div className="accessp font-bold text-xl uppercase mt-2 opacity-[.6]">
            Access your account
          </div>
          <p className=' opacity-[.5] text-sm'>
            Login with your google account to continue.
          </p>
        </div>
        <div className="centbtn">
          <button onClick={!sub ? e => {
            log()
            setsub(true)
          } : e => { }} className="gbtn w-full flex items-center justify-center gap-2 uppercase brd rounded-xl p-2 cursor-pointer shadow-md jsdesign transition-all">
            {
              sub ?
                <i className="loading" /> :
                <>
                  <i className="bi bi-google" />
                  <span>Login with google</span>
                </>
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default G
