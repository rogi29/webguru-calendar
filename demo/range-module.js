$(document).ready(function () {
	var module 	= new Calendar('#calendars', {hide: false, format: 'DD-MM-YY'}),
		dates 	= [moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day')],
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
	module.setOpenBtn('.open-calendars', {complete: function () {
		updateDates();
	    module.update();
	}});

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
				this.moveTo(200);
				break;

			case 2:
				this.hide();
				break;

			default:
				break;
		}
	});

	module.onFill(function (e) {
		console.log(e);
	});

	module.onShow(function (e) {
		console.log(e);
	});

    module.initialise(new Date());
});
