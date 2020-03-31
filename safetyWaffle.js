(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('d3'), require('webcharts'), require('util')))
        : typeof define === 'function' && define.amd
        ? define(['d3', 'webcharts', 'util'], factory)
        : ((global = global || self),
          (global.safetyWaffle = factory(global.d3, global.webCharts, global.util)));
})(this, function(d3$1, webcharts, util) {
    'use strict';

    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, 'assign', {
            value: function assign(target, varArgs) {
                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }

    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, 'length')).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    Math.log10 = Math.log10 =
        Math.log10 ||
        function(x) {
            return Math.log(x) * Math.LOG10E;
        };

    // https://github.com/wbkd/d3-extended
    d3$1.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    d3$1.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    function rendererSettings() {
        return {
            id_col: 'state',
            time_col: 'date',
            value_labels: ['Hospital', 'Deaths'],
            show_values: false,
            sort_alpha: false,
            show_days: 14,
            values: [
                { col: 'deathIncrease', label: 'Deaths', colors: ['#fee0d2', '#de2d26'] },
                { col: 'hospitalizedIncrease', label: 'Hospital', colors: ['#fee8c8', '#e34a33'] },
                { col: 'positiveIncrease', label: 'Positives', colors: ['#efedf5', '#756bb1'] },
                { col: 'totalTestResultsIncrease', label: 'Tests', colors: ['#e5f5f9', '#2ca25f'] }
            ]
        };
    }

    function webchartsSettings() {
        return {
            x: {
                column: null,
                type: 'ordinal',
                label: 'Visit'
            },
            y: {
                column: null,
                type: 'linear',
                label: 'Value',
                behavior: 'flex',
                format: '0.2f'
            },
            marks: [
                {
                    type: 'line',
                    per: null,
                    attributes: { 'stroke-width': 0.5, stroke: '#999' }
                }
            ],
            gridlines: 'xy',
            aspect: 3,
            color_by: null,
            width: 900
        };
    }

    function syncSettings(settings) {
        // webcharts settings
        settings.x.column = settings.time_col;
        settings.y.column = settings.value_col;
        settings.marks[0].per = [settings.id_col];
        return settings;
    }

    function controlInputs() {
        return [
            {
                type: 'dropdown',
                label: 'Outcome',
                option: 'value_labels',
                multiple: true,
                values: null,
                require: true
            },
            {
                type: 'number',
                label: 'Days Shown',
                option: 'show_days',
                require: true
            },
            {
                type: 'checkbox',
                label: 'Show Raw Values',
                option: 'show_values',
                require: true
            },
            ,
            {
                type: 'checkbox',
                label: 'Sort Alphabetical',
                option: 'sort_alpha',
                require: true
            }
        ];
    }

    function syncControlInputs(controlInputs, settings) {
        //Add filters to default controls.
        var outcomeControl = controlInputs.find(function(f) {
            return f.label == 'Outcome';
        });
        outcomeControl.values = settings.values.map(function(m) {
            return m.label;
        });
        outcomeControl.start = settings.value_labels;
        return controlInputs;
    }

    function listingSettings() {
        return {
            cols: ['ID', 'Measure', 'Visit', 'Value'],
            searchable: false,
            sortable: false,
            pagination: false,
            exportable: false
        };
    }

    var configuration = {
        rendererSettings: rendererSettings,
        webchartsSettings: webchartsSettings,
        settings: Object.assign({}, rendererSettings(), webchartsSettings()),
        syncSettings: syncSettings,
        controlInputs: controlInputs,
        syncControlInputs: syncControlInputs,
        listingSettings: listingSettings
    };

    function dataPrep() {
        var config = this.config;
        config.all_times = d3
            .set(
                this.raw_data.map(function(d) {
                    return d[config.time_col];
                })
            )
            .values()
            .map(function(m) {
                return +m;
            });

        this.nested_data = d3
            .nest()
            .key(function(d) {
                return d[config.id_col];
            })
            .rollup(function(d) {
                var obj = {};
                obj.raw = d;
                obj.dates = d.map(function(m) {
                    return m[config.time_col];
                });

                //fill in dates with no data collected
                config.all_times.forEach(function(date) {
                    if (obj.dates.indexOf(date) == -1) {
                        var shell = {};
                        shell[config.id_col] = d[0][config.id_col];
                        shell[config.time_col] = date;
                        config.values.forEach(function(val) {
                            shell[val.col] = null;
                        });
                        obj.raw.push(shell);
                    }
                });
                obj.raw.sort(function(a, b) {
                    return a[config.time_col] - b[config.time_col];
                });

                //calculate value_col totals for each id
                config.values.forEach(function(val_name) {
                    obj[val_name.col + '_total'] = d3.sum(d, function(d) {
                        return d[val_name.col];
                    });
                });
                return obj;
            })
            .entries(this.raw_data);
        console.log(this.nested_data);
    }

    function setScales() {
        var chart = this;
        this.config.values.forEach(function(value) {
            var max_val = d3.max(chart.nested_data, function(state) {
                console.log(state);
                return d3.max(state.values.raw, function(d) {
                    return d[value.col];
                });
            });
            var power_of_10 = ('' + max_val).length;
            value.max_cut = Math.pow(10, power_of_10 - 1);
        });
    }

    function onInit() {
        dataPrep.call(this);
        setScales.call(this);
    }

    function onLayout() {
        var config = this.config;
        this.controls.wrap
            .selectAll('div.control-group')
            .filter(function(d) {
                return d.label == 'Outcome';
            })
            .select('select')
            .selectAll('option')
            .attr('selected', function(d) {
                return config.value_labels.indexOf(d) > -1 ? 'selected' : null;
            });
    }

    function onPreprocess() {
        chart.listing.draw([]);
        chart.listing.wrap.style('display', 'none');
    }

    function onDatatransform() {}

    function makeHeader(value) {
        var config = this.config;
        var start_date = d3.time.format('%Y%m%d').parse('' + d3.min(config.all_times));
        var start_datef = d3.time.format('%d%b')(start_date);
        var end_date = d3.time.format('%Y%m%d').parse('' + d3.max(config.all_times));
        var end_datef = d3.time.format('%d%b')(end_date);

        this.waffle.head1
            .append('th')
            .text(value.label)
            .style('border-bottom', '2px solid #999')
            .attr('colspan', Math.floor(config.show_days + 1))
            .style('border-collapse', 'separate');
        this.waffle.head1
            .append('th')
            .attr('class', 'spacer')
            .style('width', '0.2em');

        /*
        this.waffle.head2
            .append('th')
            .attr('class', 'th-start')
            .attr('colspan', Math.floor(config.show_days  / 2))
            .style('text-align', 'left')
            //.style('border-', '1px solid #ccc')
            .style('padding-left', '0.2em')
            .html(start_datef + '&#x2192;');
        */
        this.waffle.head2
            .append('th')
            .attr('class', 'th-end')
            //.attr('colspan', Math.ceil(config.show_days / 2))
            .attr('colspan', config.show_days)
            .style('text-align', 'right')
            .style('padding-right', '0.2em')
            .html('&#x2190;' + end_datef);

        this.waffle.head2
            .append('th')
            .text('Total')
            .style('padding-left', '0.2em')
            .style('text-align', 'left');

        this.waffle.head2
            .append('th')
            .attr('class', 'spacer')
            .style('width', '0.2em');
    }

    function makeRows(value) {
        var config = this.config;

        var colorScale = d3.scale
            .linear()
            .domain([1, value.max_cut])
            .range(value.colors)
            .interpolate(d3.interpolateHcl);

        this.waffle.rows
            .selectAll('td.values.' + value.col)
            .data(function(d) {
                return d.values.raw;
            })
            .enter()
            .append('td')
            .attr('class', 'values ' + value.col)
            .text(function(d) {
                return config.show_values ? d[value.col] : '';
            })
            .style('width', '6px')
            .attr('title', function(d) {
                return (
                    config.id_col +
                    ':' +
                    d[config.id_col] +
                    '\n' +
                    config.time_col +
                    ':' +
                    d[config.time_col] +
                    '\n' +
                    value.label +
                    ':' +
                    d[value.col]
                );
            })
            .style('background', function(d) {
                return d[value.col] == null
                    ? 'white'
                    : d[value.col] == 0
                    ? 'white'
                    : d[value.col] < value.max_cut
                    ? colorScale(d[value.col])
                    : value.colors[1];
            })
            .style('display', function(d) {
                return d.hidden ? 'none' : null;
            })
            .style('font-size', '0.6em')
            .style('padding', '0 0.2em')
            .style('color', '#333')
            .style('text-align', 'center')
            .style('cursor', 'pointer')
            .style('border', function(d) {
                return d[value.col] == null ? null : '1px solid #ccc';
            });

        this.waffle.rows
            .append('td')
            .attr('class', 'total')
            .text(function(d) {
                return d.values[value.col + '_total'];
            })
            .style('font-weight', 'lighter')
            .style('text-align', 'left')
            .style('font-size', '0.8em')
            .style('padding-left', '0.2em');
        // .style('border-right', '1px solid #999');

        this.waffle.rows
            .append('th')
            .attr('class', 'spacer')
            .style('width', '0.2em');
    }

    function makeWaffle() {
        var chart = this;
        var config = this.config;
        var waffle = this.waffle;

        waffle.wrap.selectAll('*').remove();

        // draw the waffle chart
        waffle.table = waffle.wrap.append('table').style('border-collapse', 'collapse');

        waffle.head = waffle.table.append('thead');
        waffle.head1 = waffle.head.append('tr');
        waffle.head2 = waffle.head
            .append('tr')
            .style('font-size', '0.7em')
            .style('font-weight', 'lighter');

        waffle.head1
            .append('th')
            .attr('class', 'th-id')
            .text('State')
            .style('text-align', 'left')
            .attr('rowspan', 2);

        waffle.tbody = waffle.table.append('tbody');

        waffle.rows = waffle.tbody
            .selectAll('tr')
            .data(chart.nested_data)
            .enter()
            .append('tr');

        waffle.rows
            .append('td')
            .attr('class', 'id')
            .style('font-weight', 'lighter')
            .style('font-size', '0.8em')
            .text(function(d) {
                return d.key;
            });

        waffle.rows
            .on('mouseover', function(d) {
                d3.select(this).style('background', '#eee');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('background', null);
            });

        var values = config.values.filter(function(f) {
            return config.value_labels.indexOf(f.label) > -1;
        });
        values.forEach(function(value) {
            makeHeader.call(chart, value);
            makeRows.call(chart, value);
        });
    }

    function sortNest() {
        var config = this.config;
        this.nested_data.sort(function(a, b) {
            if (config.sort_alpha) {
                return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
            } else {
                var totalcol =
                    config.values.filter(function(f) {
                        return config.value_labels.indexOf(f.label) > -1;
                    })[0]['col'] + '_total';
                return b.values[totalcol] - a.values[totalcol];
            }
        });
    }

    function flagDates() {
        var config = this.config;
        var day_control = this.controls.wrap.selectAll('div.control-group').filter(function(d) {
            return d.label == 'Days Shown';
        });

        //don't allow show_days > # of days of data
        if (config.show_days > config.all_times.length) {
            config.show_days = config.all_times.length;
            day_control.select('input').property('value', config.show_days);
        }

        //Flag hidden dates in nested data
        var date_count = this.config.all_times.length;
        var visible_after = date_count - this.config.show_days;
        this.nested_data.forEach(function(state) {
            state.values.raw.forEach(function(date, i) {
                date.hidden = i < visible_after;
            });
        });

        //show the date range in the control
        var end_date_n = d3.max(config.all_times);
        var end_date = d3.time.format('%Y%m%d').parse('' + end_date_n);

        var end_datef = d3.time.format('%d%b')(end_date);
        var start_date = d3.time.day.offset(end_date, -1 * config.show_days);
        var start_datef = d3.time.format('%d%b')(start_date);

        day_control.select('span.span-description').text(start_datef + '-' + end_datef);
    }

    function onDraw() {
        sortNest.call(this);
        flagDates.call(this);
        makeWaffle.call(this);
    }

    function onResize() {
        this.wrap.style('display', 'none');
    }

    function onDestroy() {
        this.listing.destroy();
    }

    var callbacks = {
        onInit: onInit,
        onLayout: onLayout,
        onPreprocess: onPreprocess,
        onDatatransform: onDatatransform,
        onDraw: onDraw,
        onResize: onResize,
        onDestroy: onDestroy
    };

    function layout(element) {
        var container = d3$1.select(element);
        container
            .append('div')
            .classed('wc-component', true)
            .attr('id', 'wc-controls');
        container
            .append('div')
            .classed('wc-component', true)
            .attr('id', 'wc-waffle')
            .style('display', 'inline-block')
            .style('vertical-align', 'top');
        container
            .append('div')
            .classed('wc-component', true)
            .attr('id', 'wc-chart')
            .style('display', 'inline-block')
            .style('vertical-align', 'top')
            .style('width', '900px');
        container
            .append('div')
            .classed('wc-component', true)
            .attr('id', 'wc-listing');
    }

    function styles() {
        var styles = [
            '.wc-chart path.highlighted{',
            'stroke-width:3px;',
            '}',
            '.wc-chart path.selected{',
            'stroke-width:5px;',
            'stroke:orange;',
            '}'
        ];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles.join('\n');
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function safetyWaffle() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        //layout and styles
        layout(element);
        styles();

        //Define chart.
        var mergedSettings = Object.assign(
            {},
            JSON.parse(JSON.stringify(configuration.settings)),
            settings
        );
        var syncedSettings = configuration.syncSettings(mergedSettings);
        var syncedControlInputs = configuration.syncControlInputs(
            configuration.controlInputs(),
            syncedSettings
        );
        var controls = webcharts.createControls(
            document.querySelector(element).querySelector('#wc-controls'),
            {
                location: 'top',
                inputs: syncedControlInputs
            }
        );
        var chart = webcharts.createChart(
            document.querySelector(element).querySelector('#wc-chart'),
            syncedSettings,
            controls
        );

        //Define chart callbacks.
        for (var callback in callbacks) {
            chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);
        } //listing
        var listing = webcharts.createTable(
            document.querySelector(element).querySelector('#wc-listing'),
            configuration.listingSettings()
        );
        listing.wrap.style('display', 'none'); // empty table's popping up briefly
        listing.init([]);

        //listing
        chart.waffle = {};
        chart.waffle.wrap = d3.select(document.querySelector(element).querySelector('#wc-waffle'));

        chart.listing = listing;
        listing.chart = chart;

        return chart;
    }

    return safetyWaffle;
});
