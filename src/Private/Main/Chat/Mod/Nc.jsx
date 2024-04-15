import React, { useContext, useState } from 'react'
import Input from './Input';
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { Conn } from '../../../../Conn';
import Obj from '../../../../Obj';
import { toast } from 'react-toastify';

let Nc = () => {
  const {k} = useContext(Conn)
  const [input, setinput] = useState(null)
  const [sub, setsub] = useState(false)
  // 
  let SubmiT = async () => {
    try {
      if (input) {
        setsub(true)
        let date = new Date()
        let ob = {
          exp: date.setSeconds(date.getSeconds() + 20),
        }
        let ax = await axios.post(`https://clpb.onrender.com/private/nc/${uuid()}`, { Authorization: Obj.encDec(JSON.stringify(ob), `${k.a}+${window.navigator.userAgent.split(/\s+/).join('')}`), isAuth: localStorage.getItem('userid'), data: { n: input, t: new Date().getTime() } })
        if (ax.data.message === 'a') {
          toast.info(`This user is already in your contact list`)
          setsub(false)
        }
        else {
          toast.info(`Contact Added to your list.`)
          setsub(false)
        }
      }
      else {
        toast.error(`Please enter the phone number to continue.`)
      }
    }
    catch {
      setsub(false)
      toast.error(`Unable to add to your contact, please try again later.`)
    }
  };

  return (
    <div className=''>
      {/* <div className="invitePath">
        <div className="linkS p-2 text-sm select-text text-center bg-[var(--border)] brd">
          https://clp-one.vercel.app/?phone=209-20903-20909
        </div>
        <div className="buttonSd flex items-center justify-center">
          <div className="button1 hover:bg-[var(--border)] cursor-pointer flex items-center justify-center w-full brd p-2">
            Copy Invite
          </div>
          <div className="button1 hover:bg-[var(--border)] cursor-pointer flex items-center justify-center w-full brd p-2">
            Share Invite
          </div>
        </div>
      </div>
      <div className="orBDev flex items-center justify-center gap-2 p-2">
        <div className="itm! h-[1px] w-full bg-[var(--border)]" />
        <div className="Txt text-2xl uppercase opacity-[.8]">OR</div>
        <div className="itm! h-[1px] w-full bg-[var(--border)]" />
      </div> */}
      <div className="ctIba">
        <div className="lagTxt capitalize text-center p-1 font-bold opacity-[.8]">
          Add new contact
        </div>
        <div className="upperTxts text-center text-xs">
          Please type in the phone number (<b>Generated</b>) of the user you would like to add to your contact.
        </div>
        <Input onCallBack={e => {
          setinput(e)
        }} isChange={true} className={`inputMain p-2`} Attributes={{ placeholder: `XXX-XXX-XXXX`, className: 'text-center rounded-lg shadow-lg p-2 bg-[var(--border)] backdrop-blur-md brd  outline-none w-full', type: "tel", name: "", id: "" }} />
        {
          input ?
            <div className="tsianke p-3 mt-[-2px]">
              <div onClick={sub ? e => {} : SubmiT} className={`bait ${sub ? ` cursor-progress pointer-events-none opacity-[.4]` : `hover:bg-[var(--border)] hover:scale-[.98] cursor-pointer`} transition-all p-2 text-center brd rounded-lg `}>
                {sub ? <><i className="loading" /></> : `Add Contact`}
              </div>
            </div> : ``
        }
      </div>
    </div>
  );
}

export default Nc
