import React, { useContext, useState } from 'react'
import { Conn } from '../../../Conn';
import CT from './CT';
import CFILE from './CFILE';
import Recursion from './Recursion';
import DateMin from './DateMinDate';

function Chatb({ val, isrepl}) {
    const { getIP, action, setaction, DeleteDTA, sendSocket} = useContext(Conn);

    const [repl, setrepl] = useState(false)

    return (
        <div className={`untopcontainer w-full brd2 Main mb-1`}>
            <div className={`aidnkhaeiandies flex items-center justify-between p-1`}>
                <div className="headertopcontainer flex items-center gap-1 p-1">
                    <i className="bi bi-person h-6 w-6 flex items-center justify-center rounded-full" />
                    <span>
                        {localStorage.getItem('id') === val.sendid ? `Me` : getIP(val.sendid)}
                    </span>
                </div>
                <div className="dropdownoptions dropdown">
                    <i className="bi bi-three-dots text-[.90rem] rounded-full  cursor-pointer h-6 bg-[var(--basebg)] w-6 flex items-center justify-center" data-bs-toggle="dropdown" aria-expanded="false" />
                    <div className="dropdownmenuse z-[100000000000] bg-[var(--basebg)] backdrop-blur-md shadow-md brd dropdown-menu">
                        <div onClick={e => {
                            setaction({
                                type: `reply`,
                                id: val.id
                            })
                        }} className="dropdownitm dropdown-item">
                            Reply
                        </div>
                        {
                            val.sendid === localStorage.getItem('id') ?
                                <>
                                    <div onClick={e => {
                                        setaction({
                                            type: `edit`,
                                            id: val.id
                                        })
                                    }} className="dropdownitm dropdown-item text-primary">
                                        Edit
                                    </div>
                                    <div onClick={e => {
                                        DeleteDTA(val.id)
                                        sendSocket(`delete`, null, val.id);
                                        // 
                                    }} className="dropdownitm dropdown-item text-danger">
                                        Delete
                                    </div>
                                </> : ''
                        }
                    </div>
                </div>
            </div>
            <div className={`messagebox_nowases min-w-[300px] ${isrepl ? ` pl-[10px]` : isrepl === null ? `pl-[40px] pr-2` : ``} text-sm w-full  items-end justify-end flex-col `}>
                {
                    val.input.trim().length < 1 ? '' :
                        <div className="innermessageboobles w-fit max-h-[400px] overflow-auto text-[13px] bg-[var(--basebg)] p-2 rounded-xl brd">
                            <CT userInput={val.input} />
                        </div>
                }
                {
                    val.file.length < 1 ? '' :
                        <div className="innermessageboobles w-full text-[13px] bg-[var(--basebg)] p-1 rounded-md brd mt-1">
                            <CFILE val={val} />
                        </div>
                }
                <div className="uploadtimeshow flex items-center w-full justify-between text-[10px]">
                    <span title={DateMin().JT(val.time).full} className=' flex items-center gap-1'>
                        {
                            DateMin().DetMinDate(val.time)
                        }
                        <span>
                            {`-`}
                        </span>
                        ({
                            DateMin().JT(val.time).half
                        })
                    </span>
                    {
                        val.replies.length < 1 ? '' :
                            <span onClick={e => { setrepl(repl ? false : true) }} className=' cursor-pointer hover:underline text-primary pr-2 w-fit'>
                                {val.replies.length < 2 ? `Reply` : `Replies`} ({val.replies.length})
                            </span>
                    }
                </div>
                
                <div className="replieschatboxsesaidnas w-full">
                    {
                        repl ?
                            <Recursion val={val} /> : ''
                    }
                </div>

            </div>
        </div>
    );
}

export default Chatb
