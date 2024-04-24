

export function formateDateTo12HoursTime(date: Date | string): string {
    let myDate: Date;
    if (typeof date === 'string') {
        myDate = new Date(date);
    }
    else {
        myDate = date;
    }

    let hours = myDate.getHours();
    let minutes = myDate.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minutesStr = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutesStr + ' ' + ampm;
    return strTime;
}