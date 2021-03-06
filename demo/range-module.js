function rangeModule() {
    var module = new Calendar('#calendars', {
            hide: true,
            format: 'DD-MM-YY'
        }),
        departDate = $('.engine .departure'),
        returnDate = $('.engine .return'),
        dates = [
          moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'),
          moment(new Date()).startOf('day'), moment(new Date()).startOf('day')
        ],
        formatedDates = [];

    dates[0].add(1, 'd');
    dates[1].add(2, 'd');
    dates[2].add(3, 'd');
    dates[3].add(4, 'd');
    dates[4].add(5, 'd');

    for (var i = 0; i < dates.length; i++) {
        formatedDates[i] = dates[i].format(module.getFormat());
    }

    function updateDates() {
        dates[0].add(1, 'd');
        dates[1].add(1, 'd');
        dates[2].add(1, 'd');
        dates[3].add(1, 'd');
        dates[4].add(1, 'd');

        for (var i = 0; i < dates.length; i++) {
            formatedDates[i] = dates[i].format(module.getFormat());
        }
    }

    function setStep(calendar, dates, selection) {
        calendar.clear();
        calendar.setDate(dates);
        calendar.setState('selection', selection || 0);
    }

    module.setCloseBtn('.close-btn');

    departDate.on('click', function() {
        module.setState('currCalendar', '1');
        module.resetPosition();
        module.show();
    });

    returnDate.on('click', function() {
        module.setState('currCalendar', '2');
        module.setDate(module.getDates());
        module.show();

        if (departDate.val() != '')
            module.moveTo(-240);
    });

    module.onRender(function(e, date) {
        var selection = this.getState('selection');

        if (dates[0].isAfter(date.unparsed))
            return {
                disabled: true,
                class_name: 'date-history'
            };

        if (formatedDates.indexOf(date.formated) > -1) {
            switch (selection) {
                case 1:
                    if (date.parsed.isAfter(e.date[0]))
                        return { class_name: 'date-available-after' };
                    if (date.parsed.isBefore(e.date[0]))
                        return { class_name: 'date-available-before' };

                    break;

                case 2:
                    if (date.parsed.isAfter(e.date[1]))
                        return { class_name: 'date-available-after' };

                    break;
            }

            return {};
        }

        return {
            disabled: true,
            class_name: 'date-unavailable'
        };
    });

    module.onChange(function(e) {
        var selection = this.getState('selection'),
            calendar = this.getState('currCalendar'),
            prevDates = this.getState('prevDates'),
            dates = this.getDates(),
            firstDate = this.formatDate(dates[0]),
            secondDate = this.formatDate(dates[1]),
            firstParsed = this.parse(dates[0]);

        switch (selection) {
            case 1:
                if (calendar == 2) {
                    firstDate = this.formatDate(prevDates[0]);

                    if (this.parse(secondDate, this.getFormat()).isBefore(prevDates[0])) {
                        firstDate = secondDate;
                        secondDate = this.formatDate(prevDates[0]);
                    }

                    setStep(this, [firstDate, secondDate]);
                    this.hide();
                } else {
                    this.moveTo(-240);
                }

                if (this.formatDate(firstParsed.endOf('month')) == firstDate)
                    this.next();

                break;

            case 2:
                this.hide();
                break;
        }

        departDate.val(firstDate);
        returnDate.val(secondDate);
    });


    module.onFill(function(e) {
        this.followMouse('date-available-before', 'date-available-after', 'date-hovered');
    });

    module.initialise(new Date());
}
