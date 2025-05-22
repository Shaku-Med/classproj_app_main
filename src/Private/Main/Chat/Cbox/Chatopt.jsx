import React from 'react'

let Chatopt = ({id}) => {
    return (
        <div className="dropdownmenuse z-[1000000000000] bg-[var(--basebg)] backdrop-blur-md shadow-md brd dropdown-menu">
            <div className={`dropdownitm dropdown-item`}>
                Block
            </div>
            <div className={`dropdownitm dropdown-item`}>
                Delete Chat
            </div>
            <div className={`dropdownitm dropdown-item`}>
                Delete Messages
            </div>
            <div className={`dropdownitm dropdown-item`}>
                Contact Info
            </div>
        </div>
    );
};

export default Chatopt
