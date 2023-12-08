import { useRef, useState } from 'react';
import './App.css';
import { Conn } from './Conn';
import Main from './Home/Main';

function App({socket}) {
  const peerRef = useRef(null);
  const [chat, setchat] = useState(null)
  // 
  return (
    <>
      <Conn.Provider value={{peerRef, socket, chat, setchat}}>
        <Main/>
      </Conn.Provider>
    </>
  )
}

export default App;
