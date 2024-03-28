import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Peer from 'peerjs';
import { v4 as uuid } from 'uuid'
import io from 'socket.io-client'
import { toast } from 'react-toastify';

// 
if (!localStorage.getItem('id')) { 
  localStorage.setItem(`id`, `${uuid().split('-').join('').toUpperCase()}`)
}

// https://clpb.onrender.com
// `https://socket.kissass.repl.co`
// https://clpb.onrender.com
// 
let socket = io(`https://clpb.onrender.com`, {
  reconnection: true,
  reconnectionAttempts: 10000,
  reconnectionDelay: 1000,
  debug: true
});


// // 
// socket.on('connect', () => { 
//     toast.info(`Connected to Server`)
// })

// socket.on('disconnect', () => {
//     socket.connect()                                                                                                                                                                                                                                                                                                                                                                                                                               
//     toast.info(`Disconnected from Server`)
// });

window.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <App socket={socket} />
  );
});