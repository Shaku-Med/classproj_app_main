import React, { useContext, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import { Conn } from '../../Conn'
import CT from './Chatb/CT'

function Cf() {

  const { sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, messages, setmessages, socket, setr, action, setaction, getReplyTo} = useContext(Conn)
  // 
  const [sub, setsub] = useState(false)
  //


  const [rl, setrl] = useState(0)


  let filesp = (fl, i) => {
    let reader = new FileReader()
    // 

    reader.onload = () => {
      try {
        let blob = URL.createObjectURL(fl[i])

        const buf = new Uint8Array(reader.result);
        
        // 
        let obj = file
        // 
        obj.unshift({
          id: uuid().toUpperCase().split('-').join(''),
          file: buf,
          type: `${fl[i].type}`,
          name: `${fl[i].name}`,
          size: `${fl[i].size}`,
          preview: blob,
          time: new Date().getTime(),
          userid: localStorage.getItem('id')
        });
        // 
        if (file.length > 10) {
          if (i === 11) {
            toast.error(`Enough! You've reached the limit (6) files per upload.`)
          }
        }
        else {
          setfile(obj)
          setrl(uuid())
        }
      }
      catch {
        toast.error(`Something went wrong.`)
      }
    }
    reader.readAsArrayBuffer(fl[i])
  };

  const Change = (e) => {
    let fl = e.target.files

    if (fl.length > 0) {
      for (let i = 0; i < fl.length; i++) {
        if (fl[i].size <= 50 * 1024 * 1024) {
          filesp(fl, i)
        }
        else if (fl[i].size > 50 * 1024 * 1024 && fl.length === 1) { 
          filesp(fl, i)
        }
        else { 
          toast.error(`Unable to upload this file (${fl[i].name}). Please just choose one of large files if you really want to upload it.`)
        }
      }
    }
  };

  let rm = (id) => {
    let fl = file
    let findind = fl.findIndex(v => v.id === id)
    if (findind !== -1) {
      fl.splice(findind, 1)
      // 
      setfile(fl)
      setrl(uuid());
    }
    else {
      toast.info(`Unable to locate file id. reload this page`)
    }
  }

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

  let DIRECT = () => {
    // 
    let data = ShareData()

    let mes = messages
    mes.push(data)
    // 
    EMPT(mes)
    // 
    sendSocket(null, data)
  };

  let RepliesAD = (id) => { 
    let mes = messages
    // 
    let targetObject = findObjectByID(mes, id)
    let repld = ShareData(true)

    targetObject.replies.push(repld)
    sendSocket(action.type, repld, id)
    // 
    EMPT(mes)
    // 
  }

  let EditTT = (id) => { 
    let mes = messages
    // 
    let targetObject = findObjectByID(mes, id)
    targetObject.input = input.trim().length < 1 ? targetObject.input : input
    targetObject.file = file.length < 1 ? targetObject.file : file

    sendSocket(action.type, null, id, input, file)

    EMPT(mes)
  }


  let SUB = () => {
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
  };

  return (
    <div className="idnaineadedse w-full flex flex-col items-start p-1 bg-[var(--border)]">
      <div className={`fileuploadpathssd ${file.length < 1 ? ' pointer-events-none' : `p-2`} transition-all flex overflow-x-auto gap-1 overflow-y-hidden w-full`}>
        {
          file.length < 1 ? '' :
            file.map((val, key) => {
              return (
                <div key={key} className="fileconteinrasd max-h-[70px] overflow-hidden flex items-center relative justify-center flex-col max-w-[70px] min-w-[70px] shadow-md p-1 brd rounded-md">
                  <i onClick={e => { rm(val.id) }} className="bi bi-x-lg bigx absolute top-[2px] cursor-pointer hover:scale-[.8] transition-all right-[2px] flex items-center justify-center h-8 w-8 brd backdrop-blur-md rounded-full bg-danger" />
                  {
                    val.type.includes('image') ?
                      <div className="aidnkkkaidnkdeaser892 w-full h-full">
                        <img loading='lazy' onLoad={e => {
                          // Use when Necessary

                          /* setTimeout(() => {
                            URL.revokeObjectURL(val.preview)
                          }, 1 * 1000) */
                          
                          //  MODIFY THIS PART IF NECESSARY (, 1 * 1000) you can change it to any time you want.
                        }} src={`${val.preview}`} className={` w-full object-cover object-top h-full rounded-md brd shadow-md overflow-hidden`} />
                      </div> :
                      <i className={`bi bi-file-earmark text-[1.3rem]`} />
                  }
                  <div title={val.name} className={`filename line-clamp-1 text-center ${val.type.includes('image') ? `absolute bottom-[5px] left-0 w-full max-w-[80px]` : ` w-full`}`}>
                    {val.name}
                  </div>
                </div>
              );
            })
        }
      </div>
      <div className="filecontenaseidnaos p-2 w-full shadow-md gap-2 join rounded-md flex items-center justify-between">
        {
          action.type !== null ?
            <div onClick={e => {
              setaction({
                type: null,
                id: null
              })
            }} className="ainkeades cursor-pointer hover:brightness-105 hover:shadow-md transition-all brd p-1 rounded-md hover:bg-[var(--basebg)]">
              <div className="uppertext opacity-[.4] text-[10px] capitalize">
                {action.type}
              </div>
              <div className="ainkidinfilesad text-[11px] line-clamp-1 max-w-[50px] max-h-[17px]">
                <CT userInput={getReplyTo(action.id)} />
              </div>
            </div> : ''
        }
        <div onKeyDown={e => {
          if (!e.shiftKey && e.key.toLowerCase().includes('enter')) {
            e.preventDefault()
            SUB()
          }
        }} ref={ref} onInput={e => { setinput(e.target.innerHTML) }} className={`diankkheaindes w-full bg-[var(--basebg)] join-item p-1 overflow-auto max-h-[100px] outline-none rounded-md brd`} contentEditable suppressContentEditableWarning />
        <div className="uploadandsub flex items-center justify-center join-item gap-1">
          <input onChange={Change} multiple type="file" id="file" className="hidden" />
          <label htmlFor="file">
            <i className="bi text-[1.5rem] bg-[var(--basebg)] brd h-8 w-8 min-w-8 max-w-8 flex items-center justify-center cursor-pointer bi-plus" />
          </label>
          {file.length > 10 ? '' : <i onClick={!sub ? SUB : e => { }} className={`bi h-8 w-8 min-w-8 max-w-8 flex ${input.trim().length < 1 && file.length < 1 ? `bg-success opacity-[.4] pointer-events-none` : `bg-success`} items-center justify-center cursor-pointer bi-send`} />}
        </div>
      </div>
    </div>
  );
}

export default Cf
