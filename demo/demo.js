$(document).ready(function () {
	pickmeup('.single', {
		flat : true
	});

	pickmeup('.multiple', {
		flat : true,
		mode : 'multiple'
	});

	pickmeup('.range', {
		flat : true,
		mode : 'range'
	});

	//Test
	var format 	= 'DD-MM-YYYY',
		dates 	= [moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day'), moment(new Date()).startOf('day')],
		formatedDates = [];

	dates[1].add(4, 'd');
	dates[2].add(9, 'd');
	dates[3].add(10, 'd');
	dates[4].add(14, 'd');

	for (var i = 0; i < dates.length; i++) {
		formatedDates[i] = dates[i].format(format);
	}

	pickmeup.defaults.locales['he'] = {
		days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	};

	var selector = '.two-calendars';

	pickmeup(selector, {
		render : function (date) {
			var dateMoment 	= moment(date).startOf('day'),
				formated 	= dateMoment.format(format);

			if (dates[0].isAfter(date))
				return {disabled : true, class_name : 'date-history'};

			if (formatedDates.indexOf(formated) > -1)
				return {};

			return {disabled : true, class_name : 'date-history'};
		},
		first_day : 0,
		locale	  : 'he',
		flat      : true,
		date      : [
			dates[0].format(format)
		],
		mode      : 'range',
		calendars : 2
	});

	function updateDates () {
		dates[1].add(1, 'd');
		dates[2].add(1, 'd');
		dates[3].add(1, 'd');
		dates[4].add(1, 'd');

		for (var i = 0; i < dates.length; i++) {
			formatedDates[i] = dates[i].format(format);
		}

		pickmeup(selector).update();
	}

	$(selector).on('pickmeup-change', function (e) {
	    console.log(e.detail.formatted_date);
		//pickmeup(selector).next();
		updateDates();
	});
});
