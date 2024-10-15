export function getDateString(date) {
    const dateArr = date.split('-');
    let dateStr = '';
    for(let i = dateArr.length-1; i >= 0; i--) {
        dateStr += dateArr[i] + (i !== 0 ? '.' : '')
    }
    
    return dateStr;
}