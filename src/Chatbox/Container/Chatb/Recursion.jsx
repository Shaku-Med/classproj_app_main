import React from 'react'
import Chatb from './Chatb';

let Recursion = ({ val }) => {
    return (
        <>
            {
                val.replies.length < 1 ? '' :
                    val.replies.map((v, k) => {
                        return ( 
                             <Chatb isrepl={k > 4 ? false : true} key={k} val={v}/>
                         )       
                    })
            }
        </>
    );
};

export default Recursion
