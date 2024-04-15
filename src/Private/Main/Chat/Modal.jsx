import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Profile from './Mod/Profile';
import PicPiv from './Mod/Prevpic';
import Nc from './Mod/Nc';
import { Conn } from '../../../Conn';

let Modal = ({ selectedId, setSelectedId, items, className, acid, isP}) => {
    const { k, getKUser } = useContext(Conn);
    const [picid, setpicid] = useState(null);

    let find = (id) => {
        try {
            if (isP) {
                return 'profile'
            }
            else {
                return items.find(item => item.id === id).title.toLowerCase()
            }
        }
        catch {
            return null
        }
    };

    return (
        <>
            {
                getKUser() ?
                    <>
                        <AnimatePresence>
                            <div className={`contC ${selectedId ? `z-[10000000000000] fixed top-0 w-full h-full left-0 flex items-center justify-center p-2` : `hidden opacity-0 pointer-events-none`}`}>
                                <div onClick={() => setSelectedId(null)} className="dimsz fixed top-0 left-0 w-full transition-all h-full bg-[var(--basebg)] backdrop-grayscale cursor-pointer" />
                                {selectedId && (
                                    <motion.div className={className} layoutId={selectedId}>
                                        <div className="dataSetSheaders w-full uppercase text-center p-2">
                                            {find(selectedId)}
                                            <hr />
                                        </div>
                                        <div className="contentCenter w-full relative overflow-auto">
                                            {
                                                find(selectedId) ?
                                                    find(selectedId).includes('profile') ? <Profile isP={isP} acid={acid ? acid : []} selectedId={picid} setSelectedId={setpicid} /> : <Nc /> : ``
                                            }
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </AnimatePresence>
            
                        <PicPiv data={acid ? acid.length > 0 ? acid[0].picture : getKUser() : getKUser()} ssid={setpicid} sid={picid} className={' w-full h-full relative overflow-hidden max-w-[800px]'} />
                    </> : ``
            }

        </>
    );
}

export default Modal
