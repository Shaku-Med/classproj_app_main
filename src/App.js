import { useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { Conn } from './Conn';
import Main from './Home/Main';
import { v4 as uuid } from 'uuid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 
function App({ socket }) {

    const [pvT, setpvT] = useState(null)

    const [file, setfile] = useState([]);
    const [input, setinput] = useState('')

    let ref = useRef(null);

    const peerRef = useRef(null);
    const [chat, setchat] = useState(null)
    const [messages, setmessages] = useState([])
        // 
    const [r, setr] = useState(0)
        // 
    const [streamdata, setstreamdata] = useState([]);
    //

    let getIP = (id) => {
            if (streamdata.length > 0) {
                let ft = streamdata.find(v => v.id === id)
                if (ft) {
                    return `${ft.headers.hasOwnProperty('true-client-ip') ? ft.headers['true-client-ip'] : ft.headers.hasOwnProperty('cf-connecting-ip') ? ft.headers['cf-connecting-ip'] : ft.headers.hasOwnProperty('x-forwarded-for') ? ft.headers['x-forwarded-for'] : `Unknown`}`
      }
      else { 
        return `Unknown`
      }
    }
    else { 
      return `Unknown`
    }
  }

  //

  const [action, setaction] = useState({
    type: null,
    id: null
  })

  //

  let findObjectByID = (array, targetid) => { 
    for (const item of array) { 
      if (item.id === targetid) { 
        return item
      }
      // 
      if (item.replies && item.replies.length > 0) { 
        const foundObject = findObjectByID(item.replies, targetid);
        if (foundObject) { 
          return foundObject
        }
      }
    }
    return null
  }

  let getReplyTo = (id) => {
    let inp = findObjectByID(messages, id)

    return inp ? inp.input : ''
  }


  
  // Call this function when you want to call any of your new action thread. Example (ADDING REPLIES / OTHERS)

  let EMPT = (mes) => {
    // 
    setfile([])
    setinput('')
    setmessages(mes)
    setr(uuid())
    // 
    ref.current.innerHTML = ''
    // 
    setaction({
      type: null,
      id: null
    })

    //
  }


    // 
  let DeleteDTA = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      let mes = messages
      // 
      let targetObject = findObjectByID(mes, id)

      if (targetObject) {
        let indexToRo = mes.indexOf(targetObject)
        if (indexToRo !== -1) {
          mes.splice(indexToRo, 1)
          EMPT(mes)
        }
        else {
          toast.info(`Unable to locate Action Index`)
        }
      }
      else {
        toast.info(`Unable to find action object to delete`)
      }
    }

  };


  let sendSocket = (type, data, id, inp, fil) => { 
    socket.emit(`sendchat`, {
      type: type,
      data: data,
      id: id,
      input: inp,
      file: fil
    })
    // 
    if (socket.connected === false) { 
      socket.connect()
    }
  }


  useLayoutEffect(() => {
    try {

      socket.on('connect', () => { 
        
        socket.on('getchat', (data) => {
          setmessages(data);
        })
        
      })
      
      if (socket.connected === false) {
        socket.connect()
      }
    }
    catch {
      toast.error(`Unable to get chat messages`)
    }
  }, []);


  let setPV = (src) => {
    let sc = src.file
    let blob = new Blob([sc], { type: src.type })
    let url = URL.createObjectURL(blob)
    // 
    setpvT(url)
  };
  
  return (
    <>
      <Conn.Provider value={{ setPV, pvT, setpvT, sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, getReplyTo, action, setaction, getIP, streamdata, setstreamdata, peerRef, socket, chat, setchat, messages, setmessages, setr}}>
        <Main />
        <ToastContainer theme='dark' style={{zIndex: 10000000000000000}} position='bottom-center'/>
      </Conn.Provider>
    </>
  )
}

export default App;