(function ($, Calendar) {
    function ScrollableCalendar(opts) {
        Calendar.call(this, '#scrollableCalendar', Object.assign({
            calendars: 12,
            format: 'DD-MM-YY',
            maxCalendarsPerLoad: 3,
            minCalendarLoads: 1,
            loaderSelector: '.calendarLoader'
        }, opts));
    }

    ScrollableCalendar.prototype = Object.create(Calendar.prototype);

    ScrollableCalendar.prototype.renderCallback = function renderCallback (e, date) {
        var selection   = this.getState('selection');

        if (date.parsed.isSame(e.date[0]))
            return { selected: true, class_name: 'first-selected' };

        if (date.parsed.isSame(e.date[1]))
            return { selected: true, class_name: 'last-selected' };

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

            default:
                return { class_name: 'date-available' };
        }
    };

    ScrollableCalendar.prototype.changeCallback = function changeCallback (e) {
        var selection   = this.getState('selection'),
            dates       = this.getDates(),
            firstParsed = this.parse(dates[0]),
            secParsed   = this.parse(dates[1]);

        switch (selection) {
            case 1:
                break;

            case 2:
                break;
        }
    };

    ScrollableCalendar.prototype.fillCallback = function fillCallback (e) {
        var selection = this.getState('selection');

        if (selection < 2)
            this.followMouse('date-available-before', 'date-available-after', 'date-hovered');
    };

    ScrollableCalendar.prototype.appendLoader = function handleHeight () {
        var wrapper = $(this.selector);
        wrapper.append(wrapper.find(this.options.loaderSelector));
    };

    ScrollableCalendar.prototype.handleHeight = function handleHeight (disableStateUpdate) {
        var wrapper         = $(this.selector),
            PickMeUpEl      = wrapper.find('.pickmeup'),
            pmuInstance     = wrapper.find('.pmu-instance'),
            minLoads        = this.getState('minCalendarLoads') || this.options.minCalendarLoads,
            maxCalendars    = this.options.maxCalendarsPerLoad,
            instanceHeight  = pmuInstance.outerHeight(true);

        if (minLoads >= pmuInstance.length/maxCalendars) {
            wrapper.find(this.options.loaderSelector).addClass('hide');
            return;
        }

        PickMeUpEl.height(instanceHeight*maxCalendars*minLoads + 'px');

        if (disableStateUpdate !== true)
            this.setState('minCalendarLoads', minLoads + 1);
    };

    ScrollableCalendar.prototype.onLoaderClick =  function (callback) {
        return $(this.selector).find(this.options.loaderSelector).on('click', callback.bind(this));
    };

    ScrollableCalendar.prototype.init = function init (date) {
        this.onRender(this.renderCallback);
        this.onChange(this.changeCallback);
        this.onFill(this.fillCallback);
        this.onLoaderClick(this.handleHeight);
        this.initialise(date);
        this.appendLoader();
        this.handleHeight();

        $(document).resize(function () {
            this.handleHeight(true);
        });
    };

    window.ScrollableCalendar = ScrollableCalendar;
})($, Calendar);
