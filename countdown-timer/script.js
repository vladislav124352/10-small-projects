class Countdown {
    constructor() {
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minsEl = document.getElementById('mins');
        this.secondsEl = document.getElementById('seconds');
        this.newYears = '1 Jan 2021';
    }

    _getTotalSeconds(endDate) {
        return this.totalSeconds = (
            new Date(endDate) - new Date()
        ) / 1000;
    }

    _setWorkTimes() {
        this.days = Math.floor(this.totalSeconds / 3600 / 24);
        this.hours = Math.floor(this.totalSeconds / 3600) % 24;
        this.minutes = Math.floor(this.totalSeconds / 60) % 60;
        this.seconds = Math.floor(this.totalSeconds % 60)
    }

    _formatTime(time) {
        return time < 10 && time > 0
            ? `0${time}`
            : time
    }

    _renderTimeInHTML() {
        this._getTotalSeconds(this.newYears)
        this._setWorkTimes();
        this.daysEl.textContent = this._formatTime(this.days);
        this.hoursEl.textContent = this._formatTime(this.hours);
        this.minsEl.textContent = this._formatTime(this.minutes);
        this.secondsEl.textContent = this._formatTime(this.seconds);
    }
}

const countdown = new Countdown();
setInterval(countdown._renderTimeInHTML.bind(countdown), 1000);
