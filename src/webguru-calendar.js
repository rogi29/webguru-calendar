(function() {
    var Calendar = function (selector, options) {
        this.picker     = {};
        this.selector   = selector;
        this.display    = 'initial';
        this.counter    = 0;
        this.options    = {
            first_day:  0,
            calendars:  2,
            flat:       true,
            parent:     false,
            locale:     'he',
            mode:       'range',
            format:     Calendar.config.formats.get('default'),
            hide:       false,
            default_date:   false
        };

        this.options        = Object.assign(this.options, options);
        this.format         = this.options.format;
        this.options.format = 'd-m-Y';

        if (this.options.hide || $(this.selector).css('display') == 'none') {
            $(this.selector).hide();
            obj.display = 'none';
        }
    };

    Calendar.__formats = {default: 'DD-MM-YY'};
    Calendar.config = {
        locales: Object.assign(pickmeup.defaults.locales, {
            set: function (name, object) {
                this[name] = object;
            }
        }),

        formats: Object.assign(Calendar.__formats, {
            set: function (name, value) {
                this[name] = value;
            },

            get: function (name) {
                return this[name];
            }
        })
    };

    Calendar.prototype = {
        isHidden: function ( ) {
            return this.display == 'none';
        },

        toggle: function (options) {
            if(!this.show(options)) {
                this.hide(options);
            }
        },

        show: function(options) {
            var options = Object.assign({parent: this.selector, complete: function(){}}, options),
                parent  = $(options.parent);

            if (this.isHidden()) {
                switch(options.mode) {
                    case 'native':
                        parent.show();
                        options.complete();
                        break;
                    default:
                        parent.slideToggle(options);
                        break;
                }

                this.display = 'initial';
                return true;
            }

            return false;
        },

        hide: function(options) {
            var options = Object.assign({parent: this.selector, complete: function(){}}, options),
                parent  = $(options.parent);

            if (!this.isHidden()) {
                switch(options.mode) {
                    case 'native':
                        parent.hide();
                        options.complete();
                        break;
                    default:
                        parent.slideToggle(options);
                        break;
                }

                this.display = 'none';
                return true;
            }

            return false;
        },

        moveTo: function (to, properties, options) {
            var destination = (to instanceof $ || typeof to == 'string') ? $(to).position().left : to,
                properties  = Object.assign({left: destination}, properties),
                options     = options || {selector: this.selector},
                selector    = $(options.selector);

            selector.animate(properties, options);
        },

        prev: function() {
            return this.picker.prev();
        },

        next: function() {
            return this.picker.next();
        },

        clear: function() {
            return this.picker.clear();
        },

        update: function() {
            return this.picker.update();
        },

        destroy: function() {
            return this.picker.destroy();
        },

        getDates: function(format) {
            return this.picker.get_date(false);
        },

        setDate: function(date) {
            return this.picker.set_date(date);
        },

        formatDate: function (date, format) {
            format = format || this.getFormat();

            return moment(date).format(format);
        },

        getFormat: function (name) {
            if (typeof name == 'undefined')
                return this.format;

            return Calender.config.formats.get(name);
        },

        setFormat: function (name) {
            this.format = Calender.config.formats.get(name);
            return true;
        },

        setCloseBtn: function (selector, options) {
            var obj     = this,
                options = options || {},
                event   = options.event || 'click',
                parent  = $(options.parent || this.selector);

            parent.find(selector).on(event, function (e) {
                obj.hide(options);
            });

            return true;
        },

        setOpenBtn: function (selector, options) {
            var obj     = this,
                options = options || {},
                event   = options.event || 'click',
                parent  = $(options.parent || this.selector);

            $(selector).on(event, function (e) {
                obj.show(options);
            });

            return true;
        },

        onRender: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            this.options['render'] = function (date) {
                var parsed = moment(date).startOf('day');

                return callback({
                    unparsed:   date,
                    parsed:     parsed,
                    formated:   parsed.format(obj.format)
                });
            }

            return true;
        },

        onChange: function (callback) {
            var obj     = this,
                detail  = {};

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-change', function (e) {
                obj.counter = (obj.counter > 1) ? 0 : obj.counter + 1;
                e.detail.selection = obj.counter;
                callback.call(obj, e);
            });

            return true;
        },

        onShow: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-show', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        onHide: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-hide', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        onFill: function (callback) {
            var obj = this;

            if(typeof callback !== 'function')
                throw new TypeError("Function type - argument provided is not a function type");

            $(this.selector).on('pickmeup-fill', function (e) {
                callback.call(obj, e);
            });

            return true;
        },

        requestDates: function (url, params, callback) {
            jQuery.post(url, params, function (data) {
                callback.call(this, date);
            });

            return true;
        },

        initialise: function (dates) {
            var options     = this.options,
                selector    = this.selector;

            options['date'] = dates;
            options['min'] = dates;
            this.picker = pickmeup(selector, options);
        }
    };

    window.Calendar = Calendar;
})();
