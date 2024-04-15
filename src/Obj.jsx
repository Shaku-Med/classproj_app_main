import React from 'react'
import CryptoJS from 'crypto-js'
import { enc, dec } from 'encmed'
// 
let Obj = {
    encDec(data, key, isdec) {
        try {
            if (isdec) {
                let d = CryptoJS.AES.decrypt(`${data}`, key).toString(CryptoJS.enc.Utf8)
                if (d && d !== '') {
                    let dd = dec(d, key)
                    if (dd) {
                        return dd
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } else {
                let d = CryptoJS.AES.encrypt(enc(data, key), key).toString()
                return d
            }
        } catch {
            return null
        }
    },
    DetMinDate(timespan) {
        const formattedTimestamp = new Date(parseInt(timespan)).toISOString();
        let inputDate = new Date(formattedTimestamp);

        const currentDate = new Date();
        const diffInMilliseconds = currentDate - inputDate;
        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = currentDate.getMonth() - inputDate.getMonth() + (12 * (currentDate.getFullYear() - inputDate.getFullYear()));
        const years = Math.floor(days / 365); // Calculate the number of years

        if (seconds < 5) {
            return "just now";
        } else if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes === 1) {
            return "1 minute ago";
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours === 1) {
            return "1 hour ago";
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days === 1) {
            return "yesterday";
        } else if (days < 7) {
            return `${days} days ago`;
        } else if (weeks === 1) {
            return "1 week ago";
        } else if (weeks < 4) {
            return `${weeks} weeks ago`;
        } else if (months === 1) {
            return "1 month ago";
        } else if (months < 12) {
            return `${months} months ago`;
        } else if (years === 1) {
            return "1 year ago";
        } else {
            return `${years} years ago`;
        }
    }

};

export default Obj
