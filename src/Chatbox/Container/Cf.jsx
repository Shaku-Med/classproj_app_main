import React, { useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import { Conn } from '../../Conn'
import CT from './Chatb/CT'
import * as FFMPEG from '@ffmpeg/ffmpeg'
// 
function Cf() {

  const { DIRECT, SUB, ShareData, RepliesAD, EditTT, sendSocket, file, setfile, input, setinput, ref, DeleteDTA, EMPT, findObjectByID, messages, setmessages, socket, setr, action, setaction, getReplyTo} = useContext(Conn)
  // 
  const [sub, setsub] = useState(false)

  const [rl, setrl] = useState(0)
  const flp = useRef()


  let filesp = (fl, i) => {
    let reader = new FileReader()

    reader.onload = () => {
      try {
        let blob = URL.createObjectURL(fl[i])

        const b = new Uint8Array(reader.result);
        let obj = file

        const chunkSize = 3 * 1024 * 1024; // 3MB
        const chunks = [];
        // for (let offset = 0; offset < b.length; offset += chunkSize) {
        //   const chunk = b.subarray(offset, offset + chunkSize);
        //   chunks.push(chunk);
        // };

        for (let offset = 0; offset < b.byteLength; offset += chunkSize) {
          chunks.push(b.slice(offset, offset + chunkSize));
        }

        obj.unshift({
          id: uuid().toUpperCase().split('-').join(''),
          file: chunks,
          type: `${fl[i].type}`,
          name: `${fl[i].name}`,
          size: `${fl[i].size}`,
          preview: blob,
          time: new Date().getTime(),
          userid: localStorage.getItem('id')
        });
        // 
        if (file.length > 30) {
          if (i === 31) {
            toast.error(`Enough! You've reached the limit (30) files per upload.`)
          }
        }
        else {
          setfile(obj)
          setrl(uuid())
        }
      }
      catch (e) {
        console.log(e)
        toast.error(`Something went wrong.`)
      }
    }
    reader.readAsArrayBuffer(fl[i])
  };

  let Compress = async (fl, name) => {
    try {
      let ffmpeg = new FFMPEG.FFmpeg()
      await ffmpeg.load()
      await ffmpeg.writeFile(name, fl)
      // 
      await ffmpeg.exec(['-i', name, '-c:v', 'libx264', '-crf', '20', `output.mp4`])
      let f = await ffmpeg.readFile(`output.mp4`)
      console.log(f)
    }
    catch (e) {
      console.log(e)
      toast.error(`Unable to compress file. Please use other source to compress your file then upload or you may try again.`)
    }
  };

  const Change = (e) => {
    let fl = e.target.files

    if (fl.length > 0) {
      for (let i = 0; i < fl.length; i++) {
        if (fl[i].size <= 200 * 1024 * 1024) {
          filesp(fl, i)
          flp.current.value = '';
        }
        else {
          toast.error(`Unable to upload this file (${fl[i].name}). It's too large. Please use a file compressor to compress the file to 1KB - 200MB.`)
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
          <input ref={flp} onChange={Change} multiple type="file" id="file" className="hidden" />
          {
            action.type === 'edit' ? getReplyTo(action.id) || getReplyTo(action.id) === '' ? '' :
              <label htmlFor="file">
                <i className="bi text-[1.5rem] bg-[var(--basebg)] brd h-8 w-8 min-w-8 max-w-8 flex items-center justify-center cursor-pointer bi-plus" />
              </label> : <label htmlFor="file">
              <i className="bi text-[1.5rem] bg-[var(--basebg)] brd h-8 w-8 min-w-8 max-w-8 flex items-center justify-center cursor-pointer bi-plus" />
            </label>
          }
          {file.length > 30 ? '' : <i onClick={!sub ? e => {SUB()} : e => { }} className={`bi h-8 w-8 min-w-8 max-w-8 flex ${input.trim().length < 1 && file.length < 1 ? `bg-success opacity-[.4] pointer-events-none` : `bg-success`} items-center justify-center cursor-pointer bi-send`} />}
        </div>
      </div>
    </div>
  );
}

export default Cf
