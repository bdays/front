import moment from "moment";

export const dateFormat = 'DD/MM/YYYY';

export function isAllowedDate(date) {
    return ((dateToUnix(date) > 0)
        &&
        (dateToUnix(date) < 2147483648));
}

export function dateToUnix(date) {
    return moment(date + ' +0000', dateFormat + ' Z').unix();
}

export function unixToDate(timestamp) {
    return moment.unix(timestamp).utc();
}

export function getDayOfWeek(date) {
    let dayOfWeek = Number(moment(date, dateFormat).format('d'));
    //поправки на то, что (0) - это воскресенье (воскресенье будем считать (7) - так удобнее)
    dayOfWeek = (dayOfWeek) ? dayOfWeek : 7;
    return dayOfWeek;
}

export function getFirstDayOfMonth(date) {
    return getDayOfMonth(date, 1)
}

export function getLastDayOfMonth(date) {
    return getDayOfMonth(date, getDaysInMonth(date));
}

export function getDayOfLastMonth(date, takeDays) {
    return getFirstDayOfMonth(date).subtract(takeDays, 'days').format('DD');
}

export function getDaysInMonth(date) {
    return moment(date, "YYYY-MM").daysInMonth();
}

export function getDayOfMonth(date, day) {
    return moment(day + '/' + date.format('MM/YYYY'), "DD/MM/YYYY");
}

export function getNextMonth(date) {
    return moment(date.add(1, 'months').format(dateFormat), dateFormat)
}

export function getLastMonth(date) {
    return moment(date.subtract(1, 'months').format(dateFormat), dateFormat);
}

export function getCurrentDate() {
    return moment();
}

export function getCurrentDateInUNIX() {
    return moment().unix();
}

export function getStringFromDate(date, format) {
    return date.format(format);
}

export function getDateFromString(date, format) {
    return moment(date, format);
}
