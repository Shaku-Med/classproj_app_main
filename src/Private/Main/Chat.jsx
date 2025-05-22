import React, { useContext } from 'react'
import { Conn } from '../../Conn'
import Cc from './Chat/Cc';
import Cu from './Chat/Cu';

let Chat = () => {
    const { pchatid, setpchatid } = useContext(Conn);
    // 
    return (
        <>
            {
                pchatid ? 
                    <Cc /> :
                    <Cu/>
            }
        </>
    );
}

export default Chat
