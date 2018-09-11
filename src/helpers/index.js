export const timeStringToDecimal = time => {
    if(time === null || time === '') return '';
    const [hour, second] = time.split(':');
    return Number.parseFloat(parseInt(hour, 10) + '.' + Number.parseInt((second / 6) * 10, 10));
};

export const decimalToTimeString = time => {
    if(time === null || time === '') return '';
    const sign = time < 0 ? "-" : "";
    const min = Math.floor(Math.abs(time));
    const sec = Math.floor((Math.abs(time) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
};

export const timeTo12 = time => {
    if(time === null || time === '') return '';
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        time = time.slice (1);
        time[5] = +time[0] < 12 ? ' am' : ' pm';
        time[0] = +time[0] % 12 || 12;
    }
    return time.join ('');
};

export const timeTo24 = time => {
    if(time === null || time === '') return '';
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === "pm" && hours < 12) hours = hours + 12;
    if (AMPM === "am" && hours === 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return `${sHours}:${sMinutes}`;
};

export function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

export function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

// window.timeTo24 = timeTo24;
// window.timeTo12 = timeTo12;
// window.decimalToTimeString = decimalToTimeString;
// window.timeStringToDecimal = timeStringToDecimal;