### webguru-calendar 1.0.0 - Calendar for WebGuru
Documentation 1.0.0: https://rogi29.github.io/webguru-calendar/docs/

Webguru-calendar is an easy to use and flexible datepicker that fully utilize both `pickmeup` and `MomentJS` functionality.

#### Example Instantiation

```js
//Instantiating Calendar Object
var twoCalendars = new Calendar('#calendars', {format: 'DD-MM-YY'});
```

#### Example On Render (using: MomentJS)

```js
//Render event (using: MomentJS)
var today = moment(new Date());

twoCalendars.onRender(function(date) {
    if (today.isAfter(date.unparsed))
        return {disabled : true, class_name : 'date-history'};

    return {};
});
```

#### Example Initialization

```js
//Initializing the calendar
twoCalendars.initialise(new Date());
```
