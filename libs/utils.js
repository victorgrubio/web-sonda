import moment from 'moment';

const utils = {
    formatVideoSecond(timestamp){
        let hours = ~~(timestamp/3600);
        let mins = ~~(timestamp/60) - (60*hours);  
        let secs = timestamp - (3600*hours + 60*mins);
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`  
    },
    formatTime(alert) {
        // Do something
        if (alert.video_second >= 0){
            return this.formatVideoSecond(alert.video_second)
        }
        return moment(alert.start_datetime.$date).format("HH:mm:ss");
        
    },
    formatDate(value) {
        // Do something
        return moment(value).format("DD/MM/YYYY");
    },
}
export default utils