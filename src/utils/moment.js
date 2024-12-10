import moment from "moment-timezone";

export function secondsToMMSS(seconds) {
    return moment.utc(seconds * 1000).format('mm:ss');
}
