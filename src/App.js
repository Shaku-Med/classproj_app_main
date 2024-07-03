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
import { AnimatePresence, motion } from 'framer-motion'
import Alrt from './Home/Alrt';
import Obj from './Obj';
import Data from './Data';
import CryptoJS from 'crypto-js'
import { enc, dec } from 'medto';
import ATJ from './Home/Page/ATJ';
import getOrCreateUniqueId from './Chatbox/GetId';
// 
let audio = document.createElement('audio')
    // 
let App = ({ socket, k }) => {

  const [pvT, setpvT] = useState(null)

  const [file, setfile] = useState([]);
  const [flee, setflee] = useState([]);
  const [owner, setowner] = useState(k.hasOwnProperty('user') ? [k.user] : []);
  const [lk, setlk] = useState([]);
  const [uplprev, setuplprev] = useState([]);
  const [users, setusers] = useState([]);
  const [store, setstore] = useState([]);
  // 
  const [chid, setchid] = useState(0);
  // 
  const [input, setinput] = useState('')

  let ref = useRef(null);

  const peerRef = useRef(null);
  const [chat, setchat] = useState(null)
  // 
  const [state_p, setstate_p] = useState(localStorage.getItem('isPrivate'))
  // 
  const [r, setr] = useState(0)
  // 
  const [streamdata, setstreamdata] = useState([]);
  const [display, setdisplay] = useState(false);
  const [pdata, setpdata] = useState(false);
  const [pchatid, setpchatid] = useState(null);
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
    if (chid) {
      let f = users.find(v => v.id === chid)
      if (f) {
        let inp = findObjectByID(f.messages, id)

        return inp ? inp.input : ''
      }
    }
    else {
      let inp = findObjectByID(messages, id)

      return inp ? inp.input : ''
    }
  };


  
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

      if (!chid) {
        setmessages(mes);
      }
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
    if (chid) {
      let u = users
      let fl = u.find(v => v.id === chid)
      if (fl) {
        let m = fl.messages
        let f = m.findIndex(v => v.id === id)
        if (f !== -1) {
          m.splice(f, 1)
          setusers(u)
          setcrl(uuid())
        }
      }
    }
    else {
      let m = messages
      let f = m.findIndex(v => v.id === id)
      if (f !== -1) {
        m.splice(f, 1)
        setmessages(m)
        setr(uuid())
      }
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
  // PROGRESSIONS

  const [progress, setprogress] = useState(null)
  const [donestate, setdonestate] = useState([])
  // 
  let [psh, setpsh] = useState([]);
  const [dne, setdne] = useState(false)


  let ld = (id, value) => {
    try {
      let l = donestate
      let f = l.find(v => v.id === id)
      if (f) {
        f.value = value
        setdonestate(l)
      }
      else {
        let obj = {
          id,
          value
        }
        l.push(obj)
        setdonestate(l)
      }
    }
    catch { }
  };

  let fileSplitter = () => {
    try {

    }
    catch {
      toast.info(`Upload crashed! Re-uploading... Be patient. Do not reload this page.`)
    }
  }


  let handdLEF = (data) => {
    try {
      if (chid) {
        return Obj.encDec(JSON.stringify(data), `${k.m}+${window.navigator.userAgent.split(/\s+/).join('')}`)
      }
      else {
        return data
      }
    }
    catch { }
  }

  let filRecur = async (s, jbj, fle) => {
    try {
      // let psh = []
      let { type, data, id, inp, fil } = jbj;

      if (s <= fle.length - 1) {
        let v = fle[s]
        let nV = Object.assign({}, v)
        if (v.file.length > 0) {
          let len = nV.file.length

          let FLR = async (ob) => {
            try {
              // 
              if (ob <= len - 1) {
                let fld = nV.file[ob]
                // 
                v.file = JSON.stringify(fld);
                // 
                v.upT = new Date().toDateString().split(/\s/).join('_');
                v.ky = ob
                //

                let date = new Date();
                let abo = {
                  exp: date.setSeconds(date.getSeconds() + 10),
                };

                // v.isAuth = localStorage.getItem('userid')
                // https://chatzy-silk.vercel.app
                //application/x-www-form-urlencoded
                let ax = await axios.post(`https://chatzy-silk.vercel.app`, v, {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': enc(JSON.stringify(abo), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
                    'isAuth': localStorage.getItem('userid') ? 'true' : 'false'
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
                  FLR(ob + 1);
                  // 
                  let percent = ((s + 1) / fle.length) * 100
                  ld(id, percent)
                } else {
                  toast.error(`Upload canceled`);
                }
              }
              else {
                v.file = `/${v.userid}/main/${v.upT}/${v.id}`;
                v.preview = null;
                v.Authorization = null;
                v.isAuth = null;
                v.isr = true
                v.tty = `github`;
                v.fileLength = len
                psh.push(v);
                filRecur(s + 1, jbj, fle)
              }
            }
            catch {
              FLR(ob)
              toast.error(`Failed to upload, re - uploading. Please  wait.`)
            }
          };

          FLR(0)

        }
      }
      else {
        if (psh.length > 0) {
          data.file = ISB(psh, true);
          let og = {
            type: type,
            data: data,
            id: id,
            input: inp,
            file: []
          }
          MainSaves(handdLEF(og))
          if (chid) {
            socket.emit(`privatechat`, handdLEF(og));
          }
          else {
            socket.emit(`sendchat`, handdLEF(og));
            setfile([])
          }
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

  let MainSaves = async (dobj) => {
    try {
      if (chid) {
        let date = new Date()
        let ob = {
          exp: date.setSeconds(date.getSeconds() + 20),
        }
        let ax = await axios.post(`https://clpb.onrender.com/private/sendchat/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid'), data: dobj })
      }
      else {
        let date = new Date()
        let ob = {
          exp: date.setSeconds(date.getSeconds() + 20),
        }
        let ax = await axios.post(`https://clpb.onrender.com/sendchat/add/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid'), data: dobj })
        
      }
    }
    catch {
      toast.error(`Unable to send message, re-submitting.`)
      setTimeout(() => {
        MainSaves(dobj)
      }, 2000)
    }
  };


  let sendSocket = (type, data, id, inp, fil) => {
    try {
      if (data) {
        if (file.length > 0) {
          if (type !== 'edit') {
            let jbj = { type, data, id, inp, fil };
            filRecur(0, jbj, file)
              setfile([])
          setflee([]);
          }
          else {
            toast.error(`Sorry you can't edit a file.`)
          }
        }
        else {
          let oj = {
            type: type,
            data: data,
            id: id,
            input: ISB(inp),
            file: ISB(fil, true)
          }
          MainSaves(handdLEF(oj))
          if (chid) {
            socket.emit(`privatechat`, handdLEF(oj))
          }
          else {
            socket.emit(`sendchat`, handdLEF(oj))
          }
          // 
          if (socket.connected === false) {
            socket.connect()
          }
        }
      
      }
      else {
        let gD = (d) => {
          if (chid) {
            let obj = {}
            if (d) {
              obj = { ...d, sendid: getID() }
            }
            else {
              obj = { sendid: getID() }
            }
            // 
            return obj
          }
          else {
            return d
          }
        }
        let oj = {
          type: type,
          data: gD(data),
          id: id,
          input: ISB(inp),
          file: ISB(fil, true)
        }
        MainSaves(handdLEF(oj))
        if (chid) {
          socket.emit(`privatechat`, handdLEF(oj))
        }
        else {
          socket.emit(`sendchat`, handdLEF(oj))
        }
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
      socket.disconnect()
      socket.connect()
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
      host: `clpp.onrender.com`,
      path: `/stream`,
      // port: 3002,
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

        let date = new Date()
        let ob = {
          exp: date.setSeconds(date.getSeconds() + 20),
        }


        // https://clpb.onrender.com
        let ax = await axios.post(`https://clpb.onrender.com/get/${uuid()}?next=${next}`, {
          Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`),
          isAuth: localStorage.getItem('userid')
        }, {
          // onUploadProgress: e => {
          //   const { loaded, total } = e;
          //   const p = Math.round((loaded * 100) / total);
          //   setprogress(p)
          // },
          // onDownloadProgress: e => {
          //   const { loaded, total } = e;
          //   const p = Math.round((loaded * 100) / total);
          //   if (p === 100) {
          //     setprogress(null)
          //   } else {
          //     setprogress(p)
          //   }
          // }
        });
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
      catch (e) { }
    });
  }

  const [crl, setcrl] = useState(0)
  
  let DIRECT = (d) => {
    let data = d ? d : ShareData()
    if (chid) {
      // if (d) {
      //   d.sendid = getID()
      //   d.file = ISB(d.file, true)
      //   d.input = ISB(d.input)
      // }
      // 
      let urs = users
      let u = urs.find(v => v.id === chid)
      if (u) {
        let mes = u.messages
        // 
        if (!d) {
          mes.push(data)
          setusers(urs)
          setcrl(uuid())
          EMPT()
          // 
          sendSocket(null, data)
        }
        else {
          if (mes.length > 0) {
            let f = mes.filter(v => d.id !== v.id)
            if (f.length > 0) {
              f.push(d)
              setusers(urs)
              setcrl(uuid())
            }
          }
          else {
            mes = [data]
            setusers(urs)
            setcrl(uuid())
          }
        }
      }
    }
    else {
      // 

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

  let ISB = (isenck, isfile, isK) => {
    try {
      if (chid) {
        let u = users.find(v => v.id === chid)
        if (u) {
          let flt = owner[0].contacts.find(v => v.phone === u.phone)
          if (flt) {
            if (isenck) {
              let s = flt.enck.sort((a, b) => new Date(b.t) - new Date(a.t))
              if (s.length > 0) {
                if (isK) {
                  return s[0].k
                }
                else {
                  if (isfile) {
                    return isenck.length > 0 ? [CryptoJS.AES.encrypt(JSON.stringify(isenck), `${s[0].k}`).toString()] : []
                  }
                  else {
                    return CryptoJS.AES.encrypt(JSON.stringify(isenck), `${s[0].k}`).toString()
                  }
                }
              }
              else {
                return ''
              }
            }
            else {
              return flt.blocked
            }
          }
        }
      }
      else {
        return isenck
      }
    }
    catch {
      return ''
    }
  };
  
  let getID = () => {
    try {
      if (chid) {
        if (owner.length > 0) {
          return {
            from: owner[0].id,
            top: chid,
            isb: ISB(),
            isk: ISB('...', null, true),
            ist: new Date().toDateString()
          }
        }
        else {
          return null
        }
      }
      else {
        return localStorage.getItem('id')
      }
    }
    catch {
      return null
    }
  }

  let ShareData = (repl, id) => {
    let data = {
      input: input.trim().length < 1 ? '' : ISB(`<div clas="messageboxpath29039">${input}</div>`),
      id: uuid().toUpperCase().split('-').join(''),
      file: ISB(flee, true),
      replies: [],
      time: new Date().getTime(),
      sendid: getID(),
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
    if (chid) {
      let f = users.find(v => v.id === chid)
      if (f) {
        let mes = f.messages
        // 
        let targetObject = findObjectByID(mes, id)
        targetObject.input = input.trim().length < 1 ? targetObject.input : ISB(input)
        targetObject.file = file.length < 1 ? targetObject.file : ISB(file, true)
        // 
        sendSocket(action.type, null, id, input, file)

        EMPT(mes)
      }
    }
    else {
      let mes = messages
      // 
      let targetObject = findObjectByID(mes, id)
      targetObject.input = input.trim().length < 1 ? targetObject.input : input
      targetObject.file = file.length < 1 ? targetObject.file : file

      sendSocket(action.type, null, id, input, file)

      EMPT(mes)
    }
  };

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
            if (lk.length < 1) {
              LST(d.next)
            }
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

        // PRIVATE CHAT

        JOIND()
        
      });

      socket.on('resets', () => {
        setusrl(uuid())
      })

      socket.on('pmessage', data => {
        try {
          if (owner.length > 0) {
            let dt = JSON.parse(CryptoJS.AES.decrypt(data.messages, k.s).toString(CryptoJS.enc.Utf8))
            if (dt) {
              let us = users
              let getF = (tx) => {
                if (dt.type === 'edit' || dt.type === 'delete') {
                  return dt.data.sendid[tx]
                }
                else {
                  return dt.sendid[tx]
                }
              }
              let compare = getF('from') === owner[0].id ? getF('top') : getF('from')
              let u = us.find(v => v.id === compare)
              if (u) {
                let m = u.messages[dt.type === 'delete' ? 'findIndex' : 'find'](v => v.id === dt.id)
                let st = dt.type === 'delete' ? m !== -1 : m
                if (st) {
                  if (dt.type === 'delete') {
                    if (typeof m === 'number') {
                      // console.log(u.messages)
                      u.messages.splice(m, 1)
                      // 
                      setusers(us)
                      setcrl(uuid())
                    }
                  }
                  else if (dt.type === 'edit') {
                    m.file = dt.file
                    m.input = dt.input;
                    // 
                    setusers(us)
                    setcrl(uuid())
                  }
                 
                }
                else {
                  if (dt.type !== 'delete') {
                    u.messages.push(dt)
                    // 
                    setusers(us)
                    setcrl(uuid())
                  }
                }
              }
            }
          }
          else {
            localStorage.clear();
          }
        }
        catch (e) {
          console.log(e)
        }
      });


      socket.on('disconnect', () => {
        console.log('disconnected')
        Rconnect()
      })
      
      if (socket.connected === false) {
        socket.connect()
      }
    }
    catch {
      toast.error(`Unable to get chat messages`)
    }
  }, [r, crl]);

  const [imgF, setimgF] = useState([])

let CImg = async (id) => {
        try {
            let f = imgF.find(v => v.id === id)
            if (f) {
                return f.url
            } else {
                let obj = {
                    db: `file_cache`,
                    name: `storage`,
                    id: id
                };
                let gdb = await getOrCreateUniqueId(obj, true);
                let ul = URL.createObjectURL(gdb)
                return `${ul}+${gdb.type ? gdb.type.includes('image') ? `image/png` : gdb.type.includes('video') || gdb.type.includes('mov') || gdb.type.includes('audio') ? `video/mp4` : gdb.type : gdb.type === '' ? `text/html` : `image/png`}+${id}`
            }
        } catch {
            return null
        }
    };


  // GETTING FILE HERE

  const [pvl, setpvl] = useState(false)


  let GetFiles = (src, callback, len, type) => {
    let psh = []
    let FnC = async (ob) => {
      try {
        if (ob <= len - 1) {
          let ulr = `${type === 'github' ? `https://raw.githubusercontent.com/medzyamara` : ``}${src}_${ob}.txt`
          let ax = await axios.get(ulr);
          psh.push(Object.values(ax.data));
          FnC(ob + 1);
          // 
          Obj.addCH([ulr])
        }
        else {
          if (psh.length > 0) {
            callback(psh);
          }
          else {
            callback(null)
          }
        }
      }
      catch {

      }
    };
    
    FnC(0)
  };

  let setPV = async (src, isD, type, dty, id, len) => {
    try {
      let N = await CImg(id)
      if (N) {
        setpvl(true)
        setpvT(N)
        setpvl(false)
      }
      else {
        if (!isD) {
          setpvl(true);
          let sc = src
          // let blob = new Blob([sc], { type: src.type })
          // let url = URL.createObjectURL(blob)
          // 
          setpvT(`${sc}+${dty}+${id}`)
          // 
          setpvl(false);
          // 
          let ab = imgF
          let ob = {
            id: id,
            url: `${sc}+${dty}+${id}`
          }
          ab.push(ob)
          setimgF(ab)
        }
        else {
          if (len) {
            let callBack = (psh) => {
              let totalSize = psh.reduce((acc, chunk) => acc + chunk.length, 0);

              const concatenatedArrayBuffer = new Uint8Array(totalSize);
              let offset = 0;
              psh.forEach(chunk => {
                concatenatedArrayBuffer.set(new Uint8Array(chunk), offset);
                offset += chunk.length;
              });

              let b = new Uint8Array(concatenatedArrayBuffer)
              let bl = new Blob([b], { type: dty })
            
              setpvT(`${URL.createObjectURL(bl)}+${dty}+${id}`)
              // 
              let ab = imgF
              let ob = {
                id: id,
                url: `${URL.createObjectURL(bl)}+${dty}+${id}`
              }
              ab.push(ob)
              setimgF(ab)
              setpvl(false);

              let obj = {
                db: `file_cache`,
                name: `storage`,
                id: id,
                data: {
                  id: id,
                  value: bl
                }
              };
              getOrCreateUniqueId(obj);
            };
            setpvl(true);
            GetFiles(src, callBack, len, type);
          }
          else {
            setpvl(true);
            let ax = await axios.get(`${type === 'github' ? `https://raw.githubusercontent.com/medzyamara` : ``}${src}`)
            let b = new Uint8Array(Object.values(ax.data))
            let bl = new Blob([b], { type: dty })
            setpvT(`${URL.createObjectURL(bl)}+${dty}+${id}`)
            // 
            setpvl(false);
            // 
            let ab = imgF
            let ob = {
              id: id,
              url: `${URL.createObjectURL(bl)}+${dty}+${id}`
            }
            ab.push(ob)
            setimgF(ab)

            let obj = {
              db: `file_cache`,
              name: `storage`,
              id: id,
              data: {
                id: id,
                value: bl
              }
            };
            getOrCreateUniqueId(obj);
          }
        }
      }
    }
    catch {
      setpvT(null)
      setpvl(false);
      toast.error(`Unable to load URL`)
    }
  };

  // GET KUSR 
  let getKUser = (issingle, isv) => {
    let u = k.user
    if (u) {
      if (issingle) {
        if (isv) {
          let f = isv.picture.sort((a, b) => new Date(b.time) - new Date(a.time))
          return f[0]
        }
        else {
          let f = u.picture.sort((a, b) => new Date(b.time) - new Date(a.time))
          return f[0]
        }
      }
      else {
        let f = u.picture.sort((a, b) => new Date(b.time) - new Date(a.time))
        return f
      }
    }
    else {
      return null
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
      bottomM.scrollIntoView({ behavior: 'smooth' })
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

  const [scp, setscp] = useState([])
  const [usrl, setusrl] = useState(0)
  const [pvid, setpvid] = useState(0)
  //


  let addUsr = (data) => {
    console.log(data)
  }


  let filtME = (v, time, isfile, hasId) => {
    try {
      let cid = hasId ? hasId : chid
      if (cid) {
        let u = users.find(v => v.id === cid)
        if (u) {
          let flt = owner[0].contacts.find(v => v.phone === u.phone)
          if (flt) {
            let s = flt.enck.sort((a, b) => new Date(b.t) - new Date(a.t))
            if (s.length > 0) {
              let separateTime = new Date(time);
              let objectInRange = s.find((item, index) => {
                let currentTime = new Date(item.t);
                let nextTime = index < s.length - 1 ? new Date(s[index + 1].t) : Infinity;
                return currentTime <= separateTime
              });
              if (isfile) {
                return JSON.parse(CryptoJS.AES.decrypt(v[0], `${objectInRange.k}`).toString(CryptoJS.enc.Utf8))
              }
              else {
                return JSON.parse(CryptoJS.AES.decrypt(v, `${objectInRange.k}`).toString(CryptoJS.enc.Utf8))
              }
            }
            else {
              return ''
            }
          }
        }
      }
      else {
        return v
      }
    }
    catch {
      return isfile ? [] : ''
    }
  };

  let ReloadSocket = () => {
    try {
      if (owner.length > 0) {
        let mp = owner[0].contacts
        let u = users.filter(v => mp.some(a => a.phone === v.phone))
        if (u.length > 0) {
          let m = u.flatMap(v => v.id)
          let ch = m.find(v => JSON.stringify(v).includes('picture'))
          if (!ch) {
            socket.emit(`reset`, Obj.encDec(JSON.stringify(m), `${k.m}+${window.navigator.userAgent.split(/\s+/).join('')}`))
          }
        }
      }
    }
    catch { }
  };

  // useEffect(() => {
  //   if (owner.length > 0 && users.length > 0 && k) {
  //     ReloadSocket()
  //   }
  // }, [owner, users])
  
  // useLayoutEffect(() => { 

  // }, [])
  
  const [aniid, setaniid] = useState(null)


  return (
    <>
      {
        con && k ?
          isdomains ?
            <Conn.Provider value={{ aniid, setaniid, donestate, setdonestate, flee, setflee, store, setstore, ReloadSocket, pvid, setpvid, filtME, addUsr, getID, MainSaves, crl, setcrl, chid, setchid, users, setusers, owner, setowner, getKUser, pchatid, setpchatid, pdata, setpdata, k, scp, setscp, state_p, setstate_p, uplprev, setuplprev, GetFiles, dif, issc, setissc, scl, SCRL, CImg, imgF, setimgF, progress, r, lk, setlk, SUB, DIRECT, ShareData, RepliesAD, EditTT, setPEER, display, setdisplay, addST, JOIND, setPV, pvT, setpvT, sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, getReplyTo, action, setaction, getIP, streamdata, setstreamdata, peerRef, socket, chat, setchat, messages, setmessages, setr }}>
              <Main />
              {
                alrt && !chat ?
                  <Alrt setchat={setchat} audio={audio} alrt={alrt} setalrt={setalrt} /> : ``
              }
              {
                pvl && !pvT ?
                  <div style={{ zIndex: 10000000000000000 }} className="processingIconc bg-[var(--basebg)] backdrop-brightness-50 h-full fixed bottom-0 left-0 w-full flex-col gap-2 text-center p-2 flex items-center justify-center">
                    <i className="loading opacity-[.8] w-10" />
                    <div>
                      Loading File Please wait...
                    </div>
                    <div onClick={e => {
                      setpvl(false);
                      setpvT(null)
                    }} className="xloawmw brd w-[fit] p-2 rounded-md shadow-lg cursor-pointer bg-danger">
                      Cancle
                    </div>
                  </div> : ``
              }
              {
                k.isAuth ?
                  <Data addUsr={addUsr} setrl={setusrl} rl={usrl} /> : ''
              }

              {
                pvT !== null ?
                  <AnimatePresence>
                    {
                      aniid ?
                        <motion.div layoutId={aniid} className={`modalsiandpinchloandhigh p-2 fixed top-0 left-0 w-full h-full backdrop-blur-md z-[1000000000000000000]`}>
                          <ATJ isprev={true} />
                        </motion.div> : ''
                    }
                  </AnimatePresence>
                  : ''
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
