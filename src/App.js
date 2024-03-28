import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { Conn } from './Conn';
import Main from './Home/Main';
import { v4 as uuid } from 'uuid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'
import * as Device from 'react-device-detect'
import Peer from 'peerjs'
import axios from 'axios'
import {motion} from 'framer-motion'
import Alrt from './Home/Alrt';
// 
let audio = document.createElement('audio')
// 
let App = ({ socket }) => {

        const [pvT, setpvT] = useState(null)

        const [file, setfile] = useState([]);
        const [lk, setlk] = useState([]);
        const [input, setinput] = useState('')

        let ref = useRef(null);

        const peerRef = useRef(null);
        const [chat, setchat] = useState(null)
            // 
        const [r, setr] = useState(0)
            // 
        const [streamdata, setstreamdata] = useState([]);
        const [display, setdisplay] = useState(false);
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
  };

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

  const [messages, setmessages] = useState([]);

  let getReplyTo = (id) => {
    let inp = findObjectByID(messages, id)

    return inp ? inp.input : ''
  }


  
  // Call this function when you want to call any of your new action thread. Example (ADDING REPLIES / OTHERS)

  let EMPT = (mes, ism, ist) => {
    // 
    setfile([])
    setinput('')
    setr(uuid())
    // 
    if (!ism) {
      // 
      ref.current.innerHTML = ''
      // 
      setaction({
        type: null,
        id: null
      })

      setmessages(mes);
      //
    }
  };


  useEffect(() => { 
    setmessages(messages)
  }, [r])

  // 
  let DeleteDTA = (id) => {
    // if (window.confirm('Are you sure you want to delete this message?')) {
    //   let mes = messages
    //   // 
    //   let targetObject = findObjectByID(mes, id)

    //   if (targetObject) {
    //     let indexToRo = mes.indexOf(targetObject)
    //     if (indexToRo !== -1) {
    //       mes.splice(indexToRo, 1)
    //       EMPT(mes)
    //     }
    //     else {
    //       toast.info(`Unable to locate Action Index`)
    //     }
    //   }
    //   else {
    //     toast.info(`Unable to find action object to delete`)
    //   }
    // }
    let m = messages
    let f = m.findIndex(v => v.id === id)
    if (f !== -1) { 
      m.splice(f, 1)
      setmessages(m)
      setr(uuid())
    }
  };

  let splF = (t, c) => {
    try {
      const csb = c * 1024;
      let ch = []
      let crc = ``
      // 
      for (let i = 0; i < t.length; i++) {
        crc += t[i];

        if (crc.length * 2 >= csb) {
          ch.push(crc);
          crc = '';
        }
      }
      if (crc.length > 0) {
        ch.push(crc);
      }

      return ch;
      // 
    }
    catch {
      toast.error(`Unable to compress file.`)
    }
  };

  const [progress, setprogress] = useState(null)
  let [psh, setpsh] = useState([]);
  const [dne, setdne] = useState(false)

  let filRecur = async (s, jbj, fle) => {
    try {
      // let psh = []
      let { type, data, id, inp, fil } = jbj;

      if (s <= fle.length - 1) {
        let v = fle[s]
        // 
        v.file = JSON.stringify(v.file);
        v.upT = new Date().toDateString().split(/\s/).join('_');
        let ax = await axios.post(`https://socket-4plt.onrender.com`, v, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          onUploadProgress: e => {
            const { loaded, total } = e;
            const p = Math.round((loaded * 100) / total);
            setprogress(p)
          },
          onDownloadProgress: e => {
            const { loaded, total } = e;
            const p = Math.round((loaded * 100) / total);
            if (p === 100) {
              setprogress(null)
            } else {
              setprogress(p)
            }
          }
        });

        if (ax.data) {
          v.file = `/${v.userid}/main/${v.upT}/${v.id}.json`;
          v.preview = null;
          v.isr = true
          v.tty = `github`;
          psh.push(v);
          filRecur(s + 1, jbj, fle)
        } else {
          toast.error(`Upload canceled`);
        }
      }
      else {
        if (psh.length > 0) {
          data.file = psh;
          socket.emit(`sendchat`, {
            type: type,
            data: data,
            id: id,
            input: inp,
            file: []
          });
          setprogress(null)
          psh = []
          setpsh([])

          if (socket.connected === false) {
            socket.connect();
          }
        }
      }
    }
    catch {
      filRecur(s + 1, jbj, fle)
      setprogress(null);
      toast.error(`Unable to complete file transfer, please try again with a smaller file.`);
    }
  };


  let sendSocket = (type, data, id, inp, fil) => {
    try {
      if (data) {
        if (file.length > 0) {
          if (type !== 'edit') {
            let jbj = {type, data, id, inp, fil};
            filRecur(0, jbj, file)
            setfile([])
          }
          else {
            toast.error(`Sorry you can't edit a file.`)
          }
        }
        else {
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
      
      }
      else {
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
    }
    catch (e) { }
  };

  const [con, setcon] = useState(false)
  let Rl = useRef()

  let RC = () => {
    if (!socket.connected) {
      socket = null;
      // https://socket-4plt.onrender.com
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

  let setPEER = (addST, type, r, dif) => {
    // Perform Connection
    // peer-gvu0.onrender.com
    peerRef.current = new Peer(`${localStorage.getItem('id')}`, {
      host: `peer-gvu0.onrender.com`,
      path: `/stream`,
      port: 3002,
    })

    // Connect Check 
    peerRef.current.on('open', (id) => {
      if (type !== true) {
        socket.emit('join', dif(id))
      }
      else {
        socket.emit(`view`, { id: `${localStorage.getItem('id')}` })
      }
    })

    peerRef.current.on('call', (call) => {
      call.answer(r)
      call.on('stream', (vidstream) => {
        if (type !== true) {
          addST(vidstream, call.peer, null, display)
        }
        else {
          // console.log(vidstream)
        }
      })
    })
  }


  let addST = (r, id, data, display) => {
    // 
    let streamcontainer = document.querySelector('.streamcontainer')
    if (streamcontainer !== null) {
      // 
      let video = document.createElement('video')
      video.srcObject = r

      video.onerror = () => {
        var elements = document.querySelector(`.objElement_${id}`);
        if (elements) {
          elements.style.display = 'none'
        }
      }

      video.onloadedmetadata = () => {
        let vd = document.querySelector(`.id_${id}`)
        if (vd) {
          vd.srcObject = r
        }
      }
    }
  };

  let LST = async (next) => {
    try {
      if (next) {
        let ax = await axios.get(`https://socket-4plt.onrender.com/get/${uuid()}?next=${next}`, {
          onUploadProgress: e => {
            const { loaded, total } = e;
            const p = Math.round((loaded * 100) / total);
            setprogress(p)
          },
          onDownloadProgress: e => {
            const { loaded, total } = e;
            const p = Math.round((loaded * 100) / total);
            if (p === 100) {
              setprogress(null)
            } else {
              setprogress(p)
            }
          }
        })
        let d = ax.data
        if (d) {
          let data = d.data
          if (data.length > 0) {
            setlk(data)
          }
          // 
          if (d.next) {
            LST(d.next)
          }
        }
      }
    }
    catch {
      setTimeout(() => { LST(next) }, 2000)
    }
  };

  let JOIND = (r) => {
    socket.on('joined', d => {
      try {
        if (d) {
          let data = d.data
          if (data.length > 0) {
            let st = streamdata
            // 
            let LD = (ts) => {
              let filter = ts.filter(v => v.id !== `${localStorage.getItem('id')}`)
              if (filter !== undefined && filter.length > 0) {
                // 
                if (r) {
                  filter.map((v) => {
                    let call = peerRef.current.call(`${v.id}`, r)
                    if (call !== undefined) {
                      call.on('stream', (vidstream) => {
                        addST(vidstream, call.peer, v, display)
                      })
                    }
                  });
                }
                else {
                  filter.map((v) => {
                    let call = peerRef.current.call(`${v.id}`, new MediaStream(), {
                      constraints: {
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true,
                      }
                    })
                    if (call !== undefined) {
                      call.on('stream', (vidstream) => {
                        addST(vidstream, call.peer, v, display)
                      })
                    }
                  });
                }
              }
            };
            // 
            if (st.length > 0) {
              let f = st.filter(v => !data.some(dt => dt.id === v.id))
              if (f.length > 0) {
                st.concat(data)
                setstreamdata(st)
                // 
                LD(st)
                setr(uuid())
                // 
              }
              else {
                data.map(item => {
                  let index = st.findIndex(v => v.id === item.id);
                  if (index !== -1) {
                    st[index] = data.find(dt => dt.id === item.id);
                    // 
                    setstreamdata(st)
                    setr(uuid());
                  }
                  else {
                    st.push(item)
                    setstreamdata(st)
                    setr(uuid());
                  }
                });
                // 
                setstreamdata(st)
                // 
                setr(uuid())
              }
            }
            else {
              st = data
              setstreamdata(st)
              LD(st)
              setr(uuid())
            }
          }
        }
      }
      catch (e) {}
    });
  }
  
  let DIRECT = (d) => {
    // 
    let data = d ? d : ShareData()

    let mes = messages
    
    if (!d) {
      mes.push(data)
      // 
      EMPT(mes)
      // 
      sendSocket(null, data)
    }
    else {
      if (mes.length > 0) {
        let f = mes.filter(v => d.id !== v.id)
        if (f.length > 0) {
          f.push(d)
          setmessages(f)
        }
      }
      else {
        mes = [data]
        setmessages(mes)
        setr(uuid())
        // 
      }
    }
  };

  let SUB = (data) => {
    setTimeout(SCRL, 200)
    if (data) {
      if (data.ty !== null) {
        if (data.ty.includes('reply')) {
          RepliesAD(data.nid, data)
        }
        else {
          DIRECT(data);
        }
      }
      else {
        DIRECT(data)
      }
    }
    else {
      if (file.length > 0 || input.trim().length > 0) {
        if (action.type !== null) {
          if (action.type.includes('reply')) {
            RepliesAD(action.id)
          }
          else if (action.type.includes('edit')) {
            EditTT(action.id)
          }
          else {
            toast.error(`Action not yet verified`)
          }
        }
        else {
          DIRECT()
        }
      }
    }
  };


    // Call this function when you want to create a new thread.

  let ShareData = (repl, id) => { 
    let data = {
      input: input.trim().length < 1 ? '' : `<div clas="messageboxpath29039">${input}</div>`,
      id: uuid().toUpperCase().split('-').join(''),
      file: file,
      replies: [],
      time: new Date().getTime(),
      sendid: localStorage.getItem('id'),
      replid: repl ? id : null
    }
    return data
  }

  //

  let RepliesAD = (id, dta) => {
    let mes = messages
    // let targetObject = findObjectByID(mes, id)
    let repld = dta ? dta : ShareData(true)
    DIRECT(repld);
    // 
    setr(uuid())
    if (!dta) {
      sendSocket(action.type, repld, id);
      EMPT(mes);
    }
    // 
    // if (!dta) {
    //   // targetObject.replies.push(repld)
    //   // 
    //   EMPT(mes);
    // }
    // else {
    //    EMPT(mes);
    // }
  };

  let EditTT = (id) => { 
    let mes = messages
    // 
    let targetObject = findObjectByID(mes, id)
    targetObject.input = input.trim().length < 1 ? targetObject.input : input
    targetObject.file = file.length < 1 ? targetObject.file : file

    sendSocket(action.type, null, id, input, file)

    EMPT(mes)
  }

  const [alrt, setalrt] = useState(null)
  const [issc, setissc] = useState(false)

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

        socket.on('heartStatus', e => { })

        socket.on('getchat', (d) => {
          setcon(true)
          if (d) {
            let data = d.data
            LST(d.next)
            // 
            if (data.length > 0) {
              // let d = lk
              // data.map((v, k) => {
              //   d.push(v)
              //   setlk(d)
              // })
              setlk(data)
            }
          }
        });

        socket.on('nch', (data) => {
          if (data) {
            if (data.ty === 'reply') {
              let m = messages
              let f = m.find(v => v.id === data.id)
              if (f) {
                f.file = data.file
                f.input = data.input
                // 
                setmessages(m)
                setr(uuid())
              }
              else {
                // 
                if (data.sendid !== localStorage.getItem('id')) {
                  setalrt(data)
                }
                // 
                m.push(data)
                setmessages(m)
                setr(uuid())
              }
            }
            else {
              if (data.sendid !== localStorage.getItem('id')) {
                if (data.ty === 'delete') {
                  let m = messages
                  let f = m.findIndex(v => v.id === data.id)
                  if (f !== -1) {
                    m.splice(f, 1)
                    setmessages(m)
                    setr(uuid())
                  }
                }
                else {
                  let m = messages
                  let f = m.find(v => v.id === data.id)
                  if (f) {
                    f.file = data.file
                    f.input = data.input
                    // 
                    setmessages(m)
                    setr(uuid())
                  }
                  else {
                    // 
                    setalrt(data)
                    // 
                    m.push(data)
                    setmessages(m)
                    setr(uuid())
                    // 
                    if (issc) {
                      setTimeout(SCRL, 2000)
                    }
                  }
                }
              }
            }
          }
        })
        
      });

      JOIND()

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
  }, [r]);

  const [imgF, setimgF] = useState([])

  let CImg = (id) => { 
    try {
      let f = imgF.find(v => v.id === id)
      if (f) {
        return f.url
      }
      else {
        return null
      }
    }
    catch {
      return null
    }
  }

  let setPV = async (src, isD, type, dty, id) => {
    try {
      let N = CImg(id)
      if (N) {
        setpvT(N)
      }
      else {
        if (!isD) {
          let sc = src.file
          let blob = new Blob([sc], { type: src.type })
          let url = URL.createObjectURL(blob)
          // 
          setpvT(`${url}+${dty}`)
          // 
          let ab = imgF
          let ob = {
            id: id,
            url: `${url}+${dty}`
          }
          ab.push(ob)
          setimgF(ab)
        }
        else {
          let ax = await axios.get(`${type === 'github' ? `https://raw.githubusercontent.com/medzyamara` : ``}${src}`)
          let b = new Uint8Array(Object.values(ax.data))
          let bl = new Blob([b], { type: dty })
          setpvT(`${URL.createObjectURL(bl)}+${dty}`)
          // 
          let ab = imgF
          let ob = {
            id: id,
            url: `${URL.createObjectURL(bl)}+${dty}`
          }
          ab.push(ob)
          setimgF(ab)
        }
      }
    }
    catch {
      setpvT(null)
      toast.error(`Unable to load URL`)
    }
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

  useLayoutEffect(() => {
    try {
      if (ref && ref.current !== null) {
        if (action.type !== null) {
          ref.current.focus()
        }
      }
    }
    catch { }
  }, [action]);


  let scl = useRef(null);

  let SCRL = () => {
    let bottomM = document.querySelector('.bottomM')
    if (bottomM) { 
      bottomM.scrollIntoView({behavior: 'smooth'})
    }
  };

  let plS = () => {
    audio.src = `../wa.mp4`
    audio.play().catch(e => {
      setTimeout(plS, 1000)
    })
  };

  useLayoutEffect(() => { 
    if (alrt && chat) {
      plS()
    }
  }, [alrt, chat])

  useLayoutEffect(() => { 
    if (alrt && issc) {
      setTimeout(SCRL, 200)
    }
  }, [issc, alrt])

  const [t, sett] = useState(false)

  return (
    <>
      {
        con ?
          isdomains ?
            <Conn.Provider value={{ dif, issc, setissc, scl, SCRL, CImg, imgF, setimgF, progress, r, lk, setlk, SUB, DIRECT, ShareData, RepliesAD, EditTT, setPEER, display, setdisplay, addST, JOIND, setPV, pvT, setpvT, sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, getReplyTo, action, setaction, getIP, streamdata, setstreamdata, peerRef, socket, chat, setchat, messages, setmessages, setr }}>
              <Main />
              {
                alrt && !chat ?
                  <Alrt setchat={setchat} audio={audio} alrt={alrt} setalrt={setalrt} /> : ``
              }
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
            <div onClick={con ? e => { sett(true) } : e => { }} className="dinaproxyd fixed top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center text-center p-2">
              <div className="boldtextcenter relative flex items-center justify-center flex-col text-center p-2 text-lg capitalize">
                <div className={`text-2xl uppercase ${con ? `text-warning` : ''}`}>{con ? `Touch or Click to continue` : <>Welcome to <b>Clp</b></>}</div>
                <div className={`text-xs opacity-[.6] mt-[0px] animate-pulse ${con ? 'text-info' : ''}`}>
                  {con ? `Connected. Now touch or click on your screen to continue.` : `Connecting please wait...`}
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