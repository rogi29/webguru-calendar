function packageModule() {
    var calendar = new Calendar('#packages-calendars .from', {
            mode: 'single',
            calendars: 1
        }),
        calendar2 = new Calendar('#packages-calendars .to', {
            mode: 'single',
            calendars: 1
        });

    calendar.setCloseBtn('.close-btn', {
        parent: '#packages-calendars',
        target: '#packages-calendars'
    });

    calendar.onRender(function(date) {
        var today = moment(new Date()).startOf('day');

        if (today.isAfter(date.unparsed))
            return {
                disabled: true,
                class_name: 'date-history'
            };

        return {};
    });

    calendar.initialise(new Date());
    calendar2.initialise();
    calendar2.next();
}
