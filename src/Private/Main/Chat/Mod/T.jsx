import React, { useState } from 'react'
import CT from '../../../../Chatbox/Container/Chatb/CT';

let T = ({ isEdit, label, data, isname, callBack, type }) => {
    const [edit, setedit] = useState(false);
    const [input, setinput] = useState('')
    // 
    return (
        <div className={`flc_dta bd ${isname ? `flex items-center flex-col justify-center w-full` : ``}`}>
            <div className={`mBgs ${!isname ? 'uppercase w-full sticky top-[35px] rounded-lg z-40 bg-[var(--baseBg)]' : ''}`}>
                <div className="itMS w-fit flex items-center justify-start gap-1 opacity-[.5] pr-2">
                    {
                        !isname ?
                            <>
                                <i className="bi bi-person" />
                                <span>{label}</span>
                            </> : ''
                    }
                    {
                        isEdit ?
                            <div className="tedd flex items-center justify-start gap-2">
                                {
                                    !edit ?
                                        <i onClick={e => { setedit(edit ? false : true) }} className="bi bi-pencil-square hover:text-[yellow] cursor-pointer ml-2" /> :
                                        <>
                                            <span onClick={e => {
                                                setedit(edit ? false : true)
                                                // 
                                                if (input.trim().length > 0) {
                                                    let dt = {
                                                        input,
                                                        label,
                                                        type
                                                    }
                                                    callBack(dt)
                                                }
                                            }} className={` lowercase cursor-pointer hover:underline text-danger`}>Cancle</span>
                                            <span className={` lowercase text-success`}>done</span>
                                        </>
                                }
                            </div> : ''
                    }
                </div>
            </div>
            <div onDoubleClick={isEdit ? e => {
                if (!edit) {
                    setedit(true)
                }
            } : e => { }} onBlur={isEdit ? e => {
                setedit(edit ? false : true)
                if (input.trim().length > 0) {
                    let dt = {
                        input,
                        label,
                        type
                    }
                    callBack(dt)
                }
            } : e => { }} onInput={e => {
                setinput(e.target.innerText)
            }} autoFocus={edit} contentEditable={edit} suppressContentEditableWarning className={`txMd ${!isname ? 'text-sm opacity-[.8] pl-5' : ` text-4xl text-center line-clamp-1 w-full overflow-hidden`} max-h-[200px] outline-none overflow-auto transition-all ${edit ? `border-[var(--borderThick)] border-[2px] rounded-md mb-1 shadow-md p-3` : ` select-text`}`}>
                {
                    data ?
                        <CT userInput={data} /> :
                        ''
                }
            </div>
        </div>
    )
};

export default T
