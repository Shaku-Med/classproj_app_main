import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Peer from 'peerjs';
import { v4 as uuid } from 'uuid'
import io from 'socket.io-client'
import { toast } from 'react-toastify';
import myK from './getK';
import Errors from './Alert/Errors';
import axios from 'axios'
import Obj from './Obj';
import dotenv from 'dotenv';

dotenv.config();
// 
let callBack = (k, root) => {
  // 
  if (!localStorage.getItem('id')) {
    localStorage.setItem(`id`, `${uuid().split('-').join('').toUpperCase()}`)
  }

  // https://clpb.onrender.com
  // `https://socket.kissass.repl.co`
  // https://clpb.onrender.com
  // https://clpb.onrender.com
  
  let date = new Date()
  let ob = {
    exp: date.setHours(date.getHours() + 2),
  }

  let socket = io(`https://clpb.onrender.com`, {
    reconnection: true,
    reconnectionAttempts: 10000,
    reconnectionDelay: 1000,
    debug: true,
    extraHeaders: {
      Authorization: Obj.encDec(JSON.stringify(ob), `${k.s}+${window.navigator.userAgent.split(/\s+/).join('')}`)
    }
  });


  // // 
  // socket.on('connect', () => { 
  //     toast.info(`Connected to Server`)
  // })

  // socket.on('disconnect', () => {
  //     socket.connect()                                                                                                                                                                                                                                                                                                                                                                                                                               
  //     toast.info(`Disconnected from Server`)
  // });

  root.render(<App k={k} socket={socket} />);
};

let getK = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  try {
    let k = myK()
    if (k) {
      let date = new Date()
      let ob = {
        exp: date.setSeconds(date.getSeconds() + 20),
      }
      // 
      root.render(<Errors txt={`Connecting, wait`} isuccess={true} />);
      // 
      let ax = await axios.post(`https://clpb.onrender.com/k/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), k), isAuth: localStorage.getItem('userid') }, {
        onUploadProgress: e => {
          const { loaded, total } = e;
          const p = Math.round((loaded * 100) / total);
          root.render(<Errors txt={`${p}% Success Rate`} loader={p} isuccess={true} />);
        },
        onDownloadProgress: e => {
          const { loaded, total } = e;
          const p = Math.round((loaded * 100) / total);
          root.render(<Errors txt={`${p}% Connected`} loader={p} isuccess={true} />);
        }
      })
      if (ax.data) {
        let dc = Obj.encDec(ax.data.v, k, true)
        if (dc) {
          callBack(JSON.parse(dc), root)
        }
        else {
          setTimeout(getK, 2000)
          // root.render(<Errors txt={`Ouch! something went wrong.`} />);
        }
      }
    }
    else {
      root.render(<Errors />);
    }
  }
  catch (e) {
    setTimeout(getK, 2000)
    let p = e.response
    if (p) {
      let r = e.response.data.hasOwnProperty('messages')
      if (r) {
        if (e.response.data.messages === 'signout') {
          localStorage.clear()
          window.location.reload()
        }
        else {
          root.render(<Errors txt={`${r ? e.response.data.messages : `UN - AUTHORIZED - ACCESS`}`} />);
        }
      }
      else {
        root.render(<Errors txt={`${r ? e.response.data.messages : `UN - AUTHORIZED - ACCESS`}`} />);
      }
    }
  }
};

window.addEventListener('DOMContentLoaded', e => { 
  getK()
})