import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { Conn } from './Conn';
import Main from './Home/Main';
import { v4 as uuid } from 'uuid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'
import * as Device from 'react-device-detect'
// 
let App = ({ socket }) => {

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

  const [con, setcon] = useState(false)
  let Rl = useRef()

  let RC = () => {
    if (!socket.connected) {
      socket = null;

      socket = io(`https://socket-4plt.onrender.com`, {
        reconnection: true,
        reconnectionAttempts: 10000,
        reconnectionDelay: 1000,
        debug: true
      });
    }
  };

  let Rconnect = () => { 
    socket.connect()
    // 
    Rl.current = setTimeout(RC, 3000)
  }

  let dif = (id) => {
    return {
      id: id,
      device: Device,
      width: window.innerWidth,
      height: window.innerHeight,
      useragent: window.navigator.userAgent,
      languages: window.navigator.languages,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth,
      time: new Date().getTime(),
      display: false,
    }
  };

  useLayoutEffect(() => {
    try {

      socket.on('connect', () => {
        //

        clearTimeout(RC)
        
        if (localStorage.getItem('id')) {
          socket.emit('join', dif(`${localStorage.getItem('id')}`))
        }
        else {
          localStorage.setItem(`id`, `${uuid().split('-').join('').toUpperCase()}`)
          socket.emit('join', dif(`${localStorage.getItem('id')}`))
        }

        socket.on('getchat', (data) => {
          setcon(true)
          setmessages(data);
        });
        
      })

      socket.on('disconnect', () => { 
        Rconnect()
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


  const [isdomains, setisdomains] = useState(true)

  useLayoutEffect(() => {
    setInterval(() => {
      if (window.location.hasOwnProperty('proxyUrl')) {
        if (window.location.proxyUrl !== `https://clp-one.vercel.app`) {
          setisdomains(false)
          setTimeout(() => {
            window.location.proxyUr = `https://clp-one.vercel.app`
            window.location.assign(`https://clp-one.vercel.app`)
            window.open(`https://clp-one.vercel.app`, `_self`)
          }, 2000)
        }
      }
    }, 10)
  }, [])

  useEffect(() => {
    try {
      if (ref && ref.current !== null) {
        if (action.type !== null) {
          ref.current.focus()
        }
      }
    }
    catch { }
  }, [action]);
  
  return (
    <>
      {
        con ?
          isdomains ?
            <Conn.Provider value={{ setPV, pvT, setpvT, sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, getReplyTo, action, setaction, getIP, streamdata, setstreamdata, peerRef, socket, chat, setchat, messages, setmessages, setr }}>
              <Main />
              <ToastContainer theme='dark' style={{ zIndex: 10000000000000000 }} position='bottom-center' />
            </Conn.Provider> :
            <>
              <div className="dinaproxyd fixed top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center text-center p-2">
                <div className="boldtextcenter text-center p-2 text-[1.5rem] font-bold">
                  PROXY DETECTED - LEAVE THIS PAGE.
                </div>
              </div>
            </> :
          <>
            <div className="dinaproxyd fixed top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center text-center p-2">
              <div className="boldtextcenter relative flex items-center justify-center flex-col text-center p-2 text-lg capitalize">
                <div className=' text-2xl uppercase'>Welcome to <b>Clp</b></div>
                <div className=' text-xs opacity-[.6] mt-[0px] animate-pulse'>
                  Connecting please wait...
                </div>
                <div className="loaders loading loading-ring absolute w-full" />
              </div>
            </div>
          </>
      }
    </>
  );
};

export default App;