import React from 'react'

function Errors({txt, loader, isuccess}) {
    return (
        <div className={` text-center p-2 flex flex-col items-center justify-center h-full w-full fixed top-0 left-0 text-2xl font-bold ${isuccess ? `` : `text-danger`}`}>
            <div className="ad">
                {txt ? txt : `UNABLE TO VERIFY YOUR IDENTITY`}
            </div>
            {
                loader ? 
                    <div className="aiddnoas w-full h-2 max-w-[400px] mt-2 bg-[var(--basebg)] rounded-full overflow-hidden">
                        <div style={{width: `${loader ? loader : 0}%`}} className="loaderS transition-all h-full bg-[skyblue]" />
                    </div> : 
                    ``
            }
            {
                !isuccess ?
                    <div className="getHelpnow p-2 link link-info">
                        <a href={`https://www.facebook.com/pearpic`} target="_blank" rel="noopener noreferrer">Get Help</a>
                    </div> : ``
            }
        </div>
    );
}

export default Errors
