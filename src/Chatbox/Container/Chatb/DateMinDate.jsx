import React from 'react'

let DateMin = () => {
  
    let DetMinDate = (timespan) => {
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

        return seconds < 5 ? "just now" : seconds < 60 ? `${seconds} seconds ago` : minutes === 1 ? "1 minute ago" : minutes < 60 ? `${minutes} minutes ago` : hours === 1 ? "1 hour ago" : hours < 24 ? `${hours} hours ago` : days === 1 ? "yesterday" : days < 7 ? `${days} days ago` : weeks === 1 ? "1 week ago" : weeks < 4 ? `${weeks} weeks ago` : months === 1 ? "1 month ago" : months < 12 ? `${months} months ago` : years === 1 ? "1 year ago" : `${years} years ago`;
    };

    let JT = (timespan) => {
        const formattedTimestamp = new Date(parseInt(timespan)).toISOString();
        let inputDate = new Date(formattedTimestamp);
        // 
        return {
            full: inputDate,
            half: `${inputDate.getHours()}:${inputDate.getMinutes()}${inputDate.getHours() < 12 ? `AM` : `PM`}`
        }
    }

    return { 
        DetMinDate,
        JT
    }

};


export default DateMin
