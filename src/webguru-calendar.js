/**
 * Webguru Calendar Module
 *
 * @package     webguru-calendar
 * @module      Calendar
 * @author      Gil Nimer <gilnimer@lognet-systems.com>
 * @copyright   webguru-calendar licensed under MIT
 *
 * @example
 * //Instantiating Calendar Object
 * var twoCalendars = new Calendar('#calendars', {format: 'DD-MM-YY'});
 *
 * @example
 * //Render event (using: MomentJS)
 * var today = moment(new Date());
 *
 * twoCalendars.onRender(function(date) {
 *	if (today.isAfter(date.unparsed))
 *		return {disabled : true, class_name : 'date-history'};
 *
 *	return {};
 * });
 *
 * @example
 * //Initializing the calendar
 * twoCalendars.initialise(new Date());
 */

(function() {
    /**
     * Webguru-calendar Object - A Setup for the `pickmeup` instantiation.
     * Check out 'pickmeup' documentations in order to fully utilize the module features.
     *
     * @name Calendar
     * @constructor Calendar
     * @param selector {String|Element|jQuery} The Selector of the `Element` in which the calendar would be included in.
     * @param options {Object} Options of 'pickmeup' module API with extra settings.
     */
    var Calendar = function (selector, options) {
        /**
         * Default settings
         * The default settings could be override by the `options` @param
         *
         * @type {{first_day: number, calendars: number, flat: boolean, parent: boolean, locale: string, mode: string, format: *, hide: boolean, default_date: boolean}}
         */
        this.options = Object.assign({
            first_day:      0,
            calendars:      2,
            flat:           true,
            parent:         false,
            locale:         'he',
            mode:           'range',
            format:         Calendar.config.formats.get('default'),
            hide:           false,
            default_date:   false
        }, options);

        this.picker         = {};
        this.selector       = selector;
        this.format         = this.options.format;
        this.options.format = 'd-m-Y';
        this.classes        = {button: 'pmu-button',  notInMonth: 'pmu-not-in-month'};
        this.state          = {
            display: 'initial',
            selection: 0,
            currCalendar: 1,
            prevDates: []
        };

        if (this.options.hide || $(this.selector).css('display') == 'none') {
            this.hide({mode: 'instant'});
            this.setState('display', 'none');
        }
    };

    /**
     * Formats object storage
     * @type {{default: string}}
     * @private
     */
    Calendar.__formats = {default: 'DD-MM-YY'};

    /**
     * Configuration before instantiation
     *
     * @name config
     * @memberof module:Calendar
     * @type {{locales: void, formats: void}}
     */
    Calendar.config = {
        locales: Object.assign(pickmeup.defaults.locales, {
            /**
             * Set a language
             *
             * @memberof config
             * @param name
             * @param object
             */
            set: function (name, object) {
                this[name] = object;
            }
        }),

        formats: Object.assign(Calendar.__formats, {
            /**
             * Set a date format
             *
             * @memberof config
             * @param name
             * @param value
             */
            set: function (name, value) {
                this[name] = value;
            },

            /**
             * Get a date format
             *
             * @memberof config
             * @param name
             * @returns {*}
             */
            get: function (name) {
                return this[name];
            }
        })
    };

    /**
     *
     * @type {{isHidden: Calendar.isHidden, toggle: Calendar.toggle, show: Calendar.show, hide: Calendar.hide, moveTo: Calendar.moveTo, prev: Calendar.prev, next: Calendar.next, clear: Calendar.clear, update: Calendar.update, destroy: Calendar.destroy, getDates: Calendar.getDates, setDate: Calendar.setDate, formatDate: Calendar.formatDate, getFormat: Calendar.getFormat, setFormat: Calendar.setFormat, setCloseBtn: Calendar.setCloseBtn, setOpenBtn: Calendar.setOpenBtn, onRender: Calendar.onRender, onChange: Calendar.onChange, onShow: Calendar.onShow, onHide: Calendar.onHide, onFill: Calendar.onFill, requestDates: Calendar.requestDates, initialise: Calendar.initialise}}
     */
    Calendar.prototype = {
        /**
         * Parse a date with MomentJS
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {date|Moment}
         */
        parse: function (date, format) {
            if (typeof format !== 'undefined')
                return moment(date, format);

            return moment(date);
        },

        /**
         * Check if the calendar is hidden.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {boolean}
         */
        isHidden: function ( ) {
            return this.getState('display') === 'none';
        },

        /**
         * Toggle calendar,
         * Checkout jQuery slideToggle documentation for better utilization.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param options {Object} jQuery slideToggle options api
         */
        toggle: function (options) {
            if(!this.show(options)) {
                this.hide(options);
            }
        },

        /**
         * Show calendar,
         * Checkout jQuery slideToggle documentation for better utilization.
         * <br />
         * default mode: which uses jQuery slideToggle() function.
         * <br />
         * 'instant' mode: which uses the standard jQuery show() function.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param options {Object} jQuery slideToggle options
         *
         * @returns {boolean}
         */
        show: function(options) {
            var target;

            options = Object.assign({target: this.selector, complete: function(){}}, options);
            target  = $(options.target);

            if (this.isHidden()) {
                switch(options.mode) {
                    case 'instant':
                        target.show();
                        options.complete();
                        break;
                    default:
                        target.slideToggle(options);
                        break;
                }

                this.setState('display', 'initial');
                return true;
            }

            return false;
        },

        /**
         * Show calendar,
         * Checkout jQuery slideToggle documentation for better utilization.
         * <br />
         * default mode: which uses jQuery slideToggle() function.
         * <br />
         * 'instant' mode: which uses the standard jQuery hide() function.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param options {Object} jQuery slideToggle options
         *
         * @returns {boolean}
         */
        hide: function(options) {
            var target;

            options = Object.assign({target: this.selector, complete: function(){}}, options);
            target  = $(options.target);

            if (!this.isHidden()) {
                switch(options.mode) {
                    case 'instant':
                        target.hide();
                        options.complete();
                        break;
                    default:
                        target.slideToggle(options);
                        break;
                }

                this.setState('display', 'none');
                return true;
            }

            return false;
        },

        /**
         * Move the calendar to an Element position or to a specified number
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param to {Number|String|Element|jQuery} Destination could be a number or an Element
         * @param properties {Object} jQuery Animate properties
         * @param options {Object} jQuery Animate options
         */
        moveTo: function (to, properties, options) {
            var selector,
                destination = (to instanceof $ || typeof to == 'string') ? $(to).position().left : to;

            properties  = Object.assign({left: destination}, properties);
            options     = options || {selector: this.selector};
            selector    = $(options.selector);

            selector.animate(properties, options);
        },

        /**
         * Reset calendar position
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param selector
         * @return {boolean}
         */
        resetPosition: function (selector) {
            var target = $(selector || this.selector);

            target.stop();
            target.animate({left: 0}, {duration: 0, queue: false});

            return true;
        },

        /**
         * Go to previous month
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        prev: function() {
            return this.picker.prev();
        },

        /**
         * Go to next month
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        next: function() {
            return this.picker.next();
        },

        /**
         * Clear multiple selection
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        clear: function() {
            this.setState('selection', 0);
            return this.picker.clear();
        },

        /**
         * Destroy calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        destroy: function() {
            this.clear();
            return this.picker.destroy();
        },

        /**
         * Update calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        update: function() {
            return this.picker.update();
        },

        setState: function (key, value) {
            if (typeof value === 'function') {
                this.state[key] = value(this.state[key]);
            } else {
                this.state[key] = value;
            }

            return true;
        },

        getState: function (key) {
            return this.state[key];
        },

        /**
         * Get Dates
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @returns {*}
         */
        getDates: function() {
            return this.picker.get_date(false);
        },

        /**
         * Set Date
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param date {Date|String}
         *
         * @returns {*}
         */
        setDate: function(date) {
            return this.picker.set_date(date);
        },

        /**
         * Format a date
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param date {Date|String} Date to format
         * @param format {String} Date format
         *
         * @returns {*}
         */
        formatDate: function (date, format) {
            format = format || this.getFormat();

            return moment(date).format(format);
        },

        /**
         * Get a format from the pre-configured or the default format of the calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param name {String} Format Name
         *
         * @returns {*}
         */
        getFormat: function (name) {
            if (typeof name == 'undefined')
                return this.format;

            return Calender.config.formats.get(name);
        },

        /**
         * Set a format from the pre-configured formats as default to the Calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param name {String} Format Name
         *
         * @returns {boolean}
         */
        setFormat: function (name) {
            this.format = Calender.config.formats.get(name);
            return true;
        },

        /**
         * Get the element with the selector specified on instancition
         *
         * @returns {*|jQuery|Element}
         */
        getElement: function () {
            return $(this.selector);
        },

        /**
         * Set an element as a close button for the Calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param selector {String|Element|jQuery}
         * @param options {Object}
         *
         * @returns {boolean}
         */
        setCloseBtn: function (selector, options) {
            options = options || {};

            var obj     = this,
                event   = options.event || 'click',
                parent  = $(options.parent || this.selector),
                target  = $(options.target || this.selector);

            parent.find(selector).on(event, function (e) {
                obj.hide(options);
            });

            return true;
        },

        /**
         * Set an element as an open button for the Calendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param selector {String|Element|jQuery}
         * @param options {Object}
         *
         * @returns {boolean}
         */
        setOpenBtn: function (selector, options) {
            options = options || {};

            var obj     = this,
                event   = options.event || 'click',
                parent  = $(options.parent || document),
                target  = $(options.target || this.selector);

            parent.find(selector).on(event, function (e) {
                obj.show(options);
            });

            return true;
        },

        /**
         * Executed for each day element rendering, takes date argument, allows to select, disable or add class to element
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param callback {Function}
         *
         * @returns {boolean}
         */
        onRender: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            this.options.render = function (date) {
                var parsed = obj.parse(date).startOf('day');

                return callback.call(
                    obj,
                    this,
                    {
                        unparsed:   date,
                        parsed:     parsed,
                        formated:   parsed.format(obj.format)
                    }
                );
            };

            return true;
        },

        /**
         * Triggered at date change.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param callback {Function}
         *
         * @returns {boolean}
         */
        onChange: function (callback) {
            var obj = this, dates;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-change', function (e) {
                obj.setState('selection', function (selection) {
                    return (selection > 1) ? 1 : selection + 1;
                });

                callback.call(obj, e);
                obj.setState('prevDates', obj.getDates());
            });

            return true;
        },

        /**
         * Triggered at showing.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param callback {Function}
         *
         * @returns {boolean}
         */
        onShow: function (callback) {
            var obj = this;

            if (typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-show', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        /**
         * Triggered at hiding.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param callback {Function}
         *
         * @returns {boolean}
         */
        onHide: function (callback) {
            var obj = this;

            if (typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-hide', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        /**
         * Triggered after filling of PickMeUp container with new markup of days, months, years. May be needed for inner datepicker markup editing.
         *
         * @function
         * @inner
         * @memberof module:Calendar
         * @param callback {Function}
         *
         * @returns {boolean}
         */
        onFill: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-fill', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        onDate: function (eventName, selector, callback) {
            var filter, obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            if (typeof selector === 'function') {
                callback = selector;
                selector = undefined;
            }

            filter = '.' + this.classes.button + (selector || '');

            $(this.selector)
                .find(filter)
                .on(eventName, function (e) {
                    callback.call(obj, e);
                });
        },

        /**
         * Ajax request
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param url
         * @param params
         * @param callback
         *
         * @returns {boolean}
         */
        requestDates: function (url, params, callback) {
            jQuery.post(url, params, function (data) {
                callback.call(this, date);
            });

            return true;
        },

        /**
         * Paint a date button onHover
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param hoverClass
         * @param positionClass
         * @param siblingsFn
         *
         * @returns {function}
         */
    	hoverPaint: function (hoverClass, positionClass, siblingsFn) {
            var btns = '.' + this.classes.button + '.' + positionClass;

    		return function (e) {
    			var target = $(e.target);

    			target.addClass(hoverClass);

    			target[siblingsFn]().each(function (i, el) {
    				var t = $(el);

    				if(t.hasClass(positionClass))
    					t.addClass(hoverClass);
    			})

    			target.parent().parent()[siblingsFn]().find(btns).addClass(hoverClass);
    		};
    	},

        /**
         *
         * @function
         * @private
         * @memberof module:Calendar
         *
         * @param className
         *
         * @returns {boolean}
         */
        __hoverDirSelector: function (className) {
            return '.' + className + ':not(.' + this.classes.notInMonth + ')';
        },

        /**
         * Paint dates on mouse follow
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param beforeClass
         * @param afterClass
         * @param hoverClass
         * @param selector
         *
         * @returns {boolean}
         */
        followMouse: function (beforeClass, afterClass, hoverClass, selector) {
            var obj         = this,
                beforeBtns  = this.__hoverDirSelector(beforeClass),
                afterBtns   = this.__hoverDirSelector(afterClass);

            this.onDate(
                'mouseenter',
                beforeBtns,
                obj.hoverPaint(hoverClass, beforeClass, 'nextAll')
            );

            this.onDate(
                'mouseenter',
                afterBtns,
                obj.hoverPaint(hoverClass, afterClass, 'prevAll')
            );

            this.onDate(
                'mouseleave',
                beforeBtns + ', ' + afterBtns,
                function (e) {
                    $(obj.selector).find('.' + hoverClass).removeClass(hoverClass);
                }
            );

            return true;
        },

        /**
         * Initialise Claendar
         *
         * @function
         * @inner
         * @memberof module:Calendar
         *
         * @param dates
         * @param min
         */
        initialise: function (dates, min) {
            var options     = this.options,
                selector    = this.selector;

            min = min || dates;

            options.date    = dates;
            options.min     = min;
            this.picker     = pickmeup(selector, options);
        }
    };

    window.Calendar = Calendar;
})();
