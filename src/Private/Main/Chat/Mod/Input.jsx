import React, { useState } from 'react'

let Input = ({ className, Attributes, isChange, regex, errorMessage, onCallBack}) => {
    const [input, setinput] = useState('')
    const [error, seterror] = useState(null)
    // 
    let onChange = (e) => {
        
        if (isChange) {
            let reg = /\d{3}-\d{3}-\d{4}/;
            let value = e.target.value;

            if (!reg.test(value)) {
                value = value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                // 
                if (value.includes('-')) {
                    onCallBack(value)
                    seterror({ success: true, message: `It's looks good!` });
                }
                else {
                    onCallBack(null)
                    seterror({ success: null, message: `Invalid phone number, required number type -> 123-123-1234` });
                }
            }
            else {
                onCallBack(null)
                seterror({ success: null, message: `Invalid phone number, required number type -> 123-123-1234` })
            }

            setinput(value);
        }
        else {
            let value = e.target.value;
            if (regex) {
                let reg = regex;

                if (!reg.test(value)) {
                    onCallBack(null)
                    seterror({ success: null, message: errorMessage.success });
                }
                else {
                    onCallBack(value)
                    seterror({ success: true, message: errorMessage.success });
                }
                setinput(value)
            }
            else {
                onCallBack(value)
                setinput(value)
            }
        }

    };
    // 
    return (
        <div className={className}>
            <input {...Attributes} value={input} onChange={onChange} />
            {
                error ?
                    <div className={`validates p-1 text-xs text-center ${error.success ? `text-success` : `text-[#e26b6b]`}`}>
                        {error.message}
                    </div> : ``
            }
        </div>
    );
}

export default Input
