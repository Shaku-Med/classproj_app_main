import React, { useContext } from 'react'
import { Conn } from '../../Conn';
import Chat from './Chat';
import Storage from './Storage';

let Mian = () => {
    const {pdata, setpdata} = useContext(Conn);
    // 
    return (
        <>
            {
                pdata ? 
                    <Storage /> :
                    <Chat/>
            }
        </>
    );
}

export default Mian
