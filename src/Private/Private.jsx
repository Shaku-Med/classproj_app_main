import React, { useContext } from 'react'
import Mian from './Main/Mian'
import G from './Google/G'
import { Conn } from '../Conn'
import { GoogleOAuthProvider } from '@react-oauth/google';
import isAuth from '../Alert/isAuth';

let Private = () => {
  const { k, owner, setowner } = useContext(Conn);
  
  return (
    <div className='imageinaodkichatbox transition-all absolute bottom-0 w-full overflow-hidden h-full max-h-full'>
      {
        isAuth(`userid`, k.u) && k.isAuth && owner ?
          <Mian /> :
          <>
            <GoogleOAuthProvider clientId={`${k.g}`}>
              <G />
            </GoogleOAuthProvider>
          </>
      }
    </div>
  )
};

export default Private
