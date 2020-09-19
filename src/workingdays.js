function workingdays() {
    let year = arguments.length == 1 ? arguments[0] : (new Date()).getFullYear();

    let easter = moment.easter(year)

    // Determine if date is valid, and convert to moment if necessary
    var _validateDate = function (date) {
        console.assert(moment.isMoment(date), 'Date should be a Moment-object')
        if (! moment.isMoment(date)) {
            return {
                valid: false
            }
        }

        console.assert(date.isValid(), 'Date is not valid')

        return {
            date: date,
            valid: date.isValid()
        }
    }

    this.holidays = {
        newYearsDay: moment(year + '-01-01'),
        easter: easter.clone(),
        ndEaster: easter.clone().add(1, 'days'),
        ascensionDay: easter.clone().add(39, 'days'),
        whitSunday: easter.clone().add(49, 'days'),
        whitMonday: easter.clone().add(50, 'days'),
        christmas: moment(year + '-12-25'),
        ndChristmas: moment(year + '-12-26'),
    }

    this.holidays.indexOf = function (date) {
        var valid = _validateDate(date);
        if (! valid.valid)
            return false

        date = valid.date

        for (var i in this) {
            if (! moment.isMoment(this[i])) continue

            if (date.format('MMDD') == this[i].format('MMDD')) {
                return i
            }
        }

        return -1
    }

    /**
     * Add holiday
     * @param holiday Date in format `mmdd`
     *
     * @return void
     */
    this.addHolliday = function (holiday, name) {
        console.assert(typeof name != 'undefined', 'Name your holidays')
        if (typeof name == 'undefined') {
            return false
        }
        var pattern = /([0-9]{1,2})([0-9]{2})/;
        if (typeof holiday == 'string' && pattern.test(holiday)) {
            let matches = holiday.match(pattern)
            let tmp = moment()
            tmp.year(year).month(parseInt(matches[1] - 1)).date(matches[2])
            if (tmp.isValid())
                this.holidays[name] = tmp.clone()
        }
    }

    this.isHoliday = function (date) {
        var valid = _validateDate(date)
        if (! valid.valid)
            return false;

        date = valid.date

        if (typeof this.holidays.indexOf(date) == 'string')
            return true

        return false
    }

    this.isWorkingday = function (date, saturday = true) {
        var valid = _validateDate(date)
        if (! valid.valid)
            return true

        date = valid.date

        var weekend = [0]
        if (saturday) weekend.push(6)

        if (weekend.indexOf(date.day()) == -1)
            return true

        return false
    }

    this.determineEndDate = function (startDate, numberOfWorkingdays) {
        var valid = _validateDate(startDate)
        if (! valid.valid)
            return false

        let date = valid.date

        if (typeof numberOfWorkingdays != 'number') {
            console.assert(typeof numberOfWorkingdays == 'number', 'NumberOfWorkingdays should be a number')
            return false
        }

        var today = date.clone()
        var daynumber = 0

        while (this.isHoliday(today) ||! this.isWorkingday(today)) {
            today.add(1, 'days')
        }

        while (daynumber < numberOfWorkingdays) {
            today.add(1, 'days')
            if (this.isHoliday(today)) continue
            if (! this.isWorkingday(today)) continue
            daynumber++
        }

        return today
    }
}

export default workingdays
