import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Conn } from '../../../Conn';
import CT from './CT';
import CFILE from './CFILE';
import Recursion from './Recursion';
import DateMin from './DateMinDate';
import CryptoJS from 'crypto-js';
import Obj from '../../../Obj';
// 
function Chatb({ val, isrepl, RPLS}) {
    const { donestate, setdonestate, filtME, k, chid, getIP, action, setaction, DeleteDTA, sendSocket, messages, users, owner} = useContext(Conn);

    const [repl, setrepl] = useState(false)
    const [dt, setdt] = useState([])
    
    useLayoutEffect(() => { 
        try {
            if (val) {
                let st = val
                let f = st.sort((a, b) => new Date(a.time) - new Date(b.time))
                setdt(f)            }
        } catch {}
    }, [val, chid])



    let getC = (send, isenc, getnames) => {
        try {
            if (!isenc) {
                if (chid && owner.length > 0) {
                    if (getnames) {
                        if (getnames === 'from') {
                            return owner[0].name
                        }
                        else {
                            let f = users.find(v => v.id === chid)
                            return f.name
                        }
                    }
                    else {
                        return send.from
                    }
                }
                else {
                    if (typeof send === 'object' && send !== null) {
                        return send.from
                    }
                    else {
                        return send
                    }
                }
            }
            else {
                if (owner.length > 0) {
                    return owner[0].id
                }
                else {
                    if (typeof send === 'object' && send !== null) {
                        return send.from
                    }
                    else {
                        return send
                    }
                }
            }
        }
        catch {
            if (typeof send === 'object' && send !== null) {
                return send.from
            }
            else {
                return send
            }
        }
    };

    return (
        <>
            {
                (dt || []).map((v, k) => {
                    return (
                        <div key={k} className={`untopcontainer ${v.id ? `_id_${v.id}` : ``} brd mt-1 scale-[.95] ${chid ? getC(localStorage.getItem('userid'), true) === getC(v.sendid) ? 'bg-[var(--basebg)]' : 'bg-[var(--border)]' : localStorage.getItem('id') === getC(v.sendid) ? `bg-[var(--basebg)]` : `bg-[var(--border)]`} p-1 w-full`}>
                            <div className={`aidnkhaeiandies z-[10000000000000000] flex items-center justify-between p-1`}>
                                <div className="upperContainer w-full p-1">
                                    {
                                        v.nid ?
                                            <div onClick={v.nid ? e => { RPLS(v.nid) } : e => { }} className="isrR p-1 brd w-full shadow-md rounded-md transition-all hover:scale-[.97] hover:bg-[var(--border)] cursor-pointer">
                                                Replied Message
                                            </div> : ``
                                    }
                                    <div className={`headertopcontainer flex items-center gap-1 ${v.nid ? `p-2` : `p-1`}`}>
                                        <i className={`bi bi-person h-[2rem] w-[2rem] min-w-[2rem] ${chid ? getC(localStorage.getItem('userid'), true) === getC(v.sendid) ? 'bg-danger' : 'bg-primary' : localStorage.getItem('id') === getC(v.sendid) ? `bg-danger` : `bg-primary`}  flex items-center justify-center rounded-full`} />
                                        <span title={chid ? getC(localStorage.getItem('userid'), true) === getC(v.sendid) ? getC(v.sendid, null, 'from') + ' - (me)' : getC(v.sendid, null, 'top') : localStorage.getItem('id') === getC(v.sendid) ? `Me` : getIP(v.sendid)}>
                                            {chid ? getC(localStorage.getItem('userid'), true) === getC(v.sendid) ? getC(v.sendid, null, 'from') + ' - (me)' : getC(v.sendid, null, 'top') : localStorage.getItem('id') === getC(v.sendid) ? `Me` : getIP(v.sendid)}
                                        </span>
                                    
                                    </div>
                                </div>
                                <div className="dropdownoptions dropdown">
                                    <i className="bi bi-three-dots text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false" />
                                    <div className="dropdownmenuse z-[1000000000000] bg-[var(--basebg)] backdrop-blur-md shadow-md brd dropdown-menu">
                                        <div onClick={e => {
                                            setaction({
                                                type: `reply`,
                                                id: v.id,
                                                chid: filtME(v.input, v.time)
                                            })
                                        }} className="dropdownitm dropdown-item">
                                            Reply
                                        </div>
                                        {
                                            chid ? getC(v.sendid) === getC(localStorage.getItem('userid'), true) ? v.file.length > 0 && v.input === '' ? '' :
                                                <>
                                                    <div onClick={e => {
                                                        setaction({
                                                            type: `edit`,
                                                            id: v.id,
                                                            chid: filtME(v.input, v.time)
                                                        })
                                                    }} className="dropdownitm dropdown-item text-primary">
                                                        Edit
                                                    </div>
                                                </> : '' : getC(v.sendid) === localStorage.getItem('id') ?
                                                v.file.length > 0 && v.input === '' ? '' :
                                                    <>
                                                        <div onClick={e => {
                                                            setaction({
                                                                type: `edit`,
                                                                id: v.id,
                                                                chid: filtME(v.input, v.time)
                                                            })
                                                        }} className="dropdownitm dropdown-item text-primary">
                                                            Edit
                                                        </div>
                                                    </> : ''
                                        }

                                        {
                                            chid ? getC(v.sendid) === getC(localStorage.getItem('userid'), true) ? <div onClick={e => {
                                                if (window.confirm(`Are you sure you want to delete thiss message?`)) {
                                                    DeleteDTA(v.id)
                                                    sendSocket(`delete`, null, v.id);
                                                }
                                            }} className="dropdownitm dropdown-item text-danger">
                                                Delete
                                            </div> : `` : getC(v.sendid) === localStorage.getItem('id') ?
                                                <div onClick={e => {
                                                    if (window.confirm(`Are you sure you want to delete thiss message?`)) {
                                                        DeleteDTA(v.id)
                                                        sendSocket(`delete`, null, v.id);
                                                    }
                                                }} className="dropdownitm dropdown-item text-danger">
                                                    Delete
                                                </div> : ``
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={`messagebox_nowases relative overflow-auto min-w-[300px] ${isrepl ? ` pl-[10px]` : isrepl === null ? `pl-[40px] pr-2` : ``} text-sm w-full  items-end justify-end flex-col `}>
                                {/* {console.log(v.input)} */}
                                {
                                    v.input.trim().length < 1 ? '' :
                                        <div className="innermessageboobles select-text w-fit max-h-[400px] overflow-auto text-[13px] bg-[var(--basebg)] p-2 rounded-xl brd">
                                            <CT userInput={filtME(v.input, v.time)} />
                                        </div>
                                }
                                {
                                    v.file.length < 1 ? '' :
                                        <div className="innermessageboobles overflow-auto relative w-full text-[13px] bg-[var(--basebg)] p-1 rounded-md brd mt-1">
                                            <CFILE filtME={filtME} val={v} />
                                            <div  className="loaderState absolute bottom-0 left-0 z-20 h-[5px] min-h-[5px] w-full">
                                                                <div className="loadC w-full h-full bg-primary" />
                                                            </div>
                                            {
                                                (donestate || []).map((vk, kv) => { 
                                                    if (vk.id === v.id) {
                                                        return (
                                                            <div key={kv} className="loaderState absolute bottom-0 left-0 z-20 h-[5px] min-h-[5px] w-full">
                                                                <div style={{width: vk.value}} className="loadC w-full h-full bg-danger" />
                                                            </div>
                                                        );
                                                    }
                                                })
                                            }
                                        </div>
                                }

                                <div className="messtimes text-[11px] absolute backdrop-blur-md p-1 bottom-0 right-0">{new Date(v.time).toLocaleTimeString()}</div>

                                {/* <div className="uploadtimeshow flex items-center w-full justify-between text-[10px]">
                                    <span title={DateMin().JT(v.time).full} className=' flex items-center gap-1'>
                                        {
                                            DateMin().DetMinDate(v.time)
                                        }
                                        <span>
                                            {`-`}
                                        </span>
                                        ({
                                            DateMin().JT(v.time).half
                                        })
                                    </span>
                                    {
                                        v.replies.length < 1 ? '' :
                                            <span onClick={e => { setrepl(repl ? false : true) }} className=' cursor-pointer hover:underline text-primary pr-2 w-fit'>
                                                {v.replies.length < 2 ? `Reply` : `Replies`} ({v.replies.length})
                                            </span>
                                    }
                                </div>
                 */}
                                {/* <div className="replieschatboxsesaidnas w-full">
                    {
                        repl ?
                            <Recursion val={val} /> : ''
                    }
                </div> */}

                            </div>
                        </div>
                    );
                })
            }
        </>
    );
}

export default Chatb
