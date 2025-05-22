import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import CT from '../Chatbox/Container/Chatb/CT';
// 
function Alrt({ alrt, setalrt, audio, setchat }) {

    let plS = () => {
        audio.src = `../nm.mp3`
        audio.play().catch(e => {
            setTimeout(plS, 1000)
        })
    };
    
    useEffect(() => {
        try {
            plS()
            // 
            setTimeout(() => {
                setalrt(null)
            }, 4000)
        }
        catch {
            return 0
        }
    }, [alrt]);
    return (
        <div style={{ zIndex: `10000000000000000` }} className="alertuser p-2 fixed top-0 left-0 w-full flex items-center justify-center">
            <motion.div onClick={e => { 
                setchat(true)
            }} onDragEnd={e => {
                if (e.offsetY < 28) {
                    setalrt(null)
                }
            }} drag={'y'} dragElastic dragConstraints={{ left: 2, top: -200, bottom: 20 }} className="toCenterD bg-[var(--basebg)] backdrop-blur-xl mt-2 flex pt-1 pb-1 pl-1 pr-2 max-w-[400px] rounded-lg overflow-hidden brd shadow-lg">
                <div className={`leftPic flex items-center justify-center min-w-[2.5rem] text-lg bi ${alrt.type === 'reply' ? 'bi-wechat' : alrt.file.length > 0 && alrt.input === '' ? 'bi-file-earmark' : 'bi-chat-square-text'}`} />
                <div className="baina flex flex-col">
                    <div className="boldT text-lg font-bold line-clamp-1">
                        New Message {alrt.type === 'reply' ? '- (Replied)' : alrt.file.length > 0 && alrt.input === '' ? '- (File)' : ''}
                    </div>
                    <div className="messsageitslef text-sm line-clamp-2">
                        {alrt.file.length > 0 && alrt.input === '' ? 'New file receive.' : <CT userInput={alrt.input} hast={true}/>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Alrt
