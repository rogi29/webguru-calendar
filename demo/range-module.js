$(document).ready(function () {
	var module 		= new Calendar('#calendars', {hide: true, format: 'DD-MM-YY'}),
		departDate	= $('.engine .departure'),
		returnDate 	= $('.engine .return'),
		dates 		= [moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day')],
		formatedDates = [];

	dates[0].add(1, 'd');
	dates[1].add(2, 'd');
	dates[2].add(3, 'd');
	dates[3].add(4, 'd');
	dates[4].add(5, 'd');

	for (var i = 0; i < dates.length; i++) {
		formatedDates[i] = dates[i].format(module.getFormat());
	}

	function updateDates () {
		dates[0].add(1, 'd');
		dates[1].add(1, 'd');
		dates[2].add(1, 'd');
		dates[3].add(1, 'd');
		dates[4].add(1, 'd');

		for (var i = 0; i < dates.length; i++) {
			formatedDates[i] = dates[i].format(module.getFormat());
		}
	}

	module.setCloseBtn('.close-btn');

	/*
        module.hideTrigger = true;
        module.getElement().on('mousedown', function(e) {
            module.hideTrigger = false;
        });

        departDate.on('focus', function () {
            module.hideTrigger = false;
            module.resetPosition();
            module.show();
        });

        returnDate.on('focus', function () {
            module.hideTrigger = false;
            module.setDate(module.getDates());
            module.show();
        });

        $(document).on('click', function (e) {
            if(!module.hideTrigger) {
                module.hideTrigger = true;
                return;
            }

            module.hide();
        });
    */

    module.onRender(function(date) {
		if (dates[0].isAfter(date.unparsed))
			return {disabled : true, class_name : 'date-history'};

		if (formatedDates.indexOf(date.formated) > -1)
			return {};

		return {disabled : true, class_name : 'date-unavailable'};
    });

	module.onChange(function (e) {
	    var selection 	= e.detail.selection,
			dates		= this.getDates(),
			firstDate	= this.formatDate(dates[0]),
			secondDate	= this.formatDate(dates[1]);

		switch (selection) {
			case 1:
				this.moveTo(-240);
				departDate.val(firstDate);
				break;

			case 2:
				this.hide();
				returnDate.val(secondDate);
				break;

			default:
				break;
		}
	});

    module.initialise(new Date());
});
