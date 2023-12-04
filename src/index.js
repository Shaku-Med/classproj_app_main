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


let socket = io(`http://localhost:3001`, {
  reconnection: true,
  reconnectionAttempts: 4,
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App socket={socket} />
);