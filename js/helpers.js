/**
 * Created by Teplov on 09.05.2016.
 */
class Helpers {
    constructor() {

    }

    convertDate(dateValue) {
        let date = new Date(dateValue),
            day = "0" + date.getDate(),
            month = "0" + (date.getMonth() + 1),
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = "0" + date.getMinutes(),
            seconds = "0" + date.getSeconds()
        return day.substr(-2) + '.' + month.substr(-2) + '.' + year + ' '
            + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
}


module.exports = new Helpers();