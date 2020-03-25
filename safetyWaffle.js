(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('d3'), require('webcharts')))
        : typeof define === 'function' && define.amd
        ? define(['d3', 'webcharts'], factory)
        : ((global = global || self), (global.safetyWaffle = factory(global.d3, global.webCharts)));
})(this, function(d3$1, webcharts) {
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
            value_col: 'positive',
            show_values: false,
            sort_alpha: false,
            values: ['positive', 'total', 'hospitalized', 'death'],
            filters: [] //updated in sync settings
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
                option: 'value_col',
                values: ['total', 'positive', 'hospitalized', 'death'],
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
        if (Array.isArray(settings.filters) && settings.filters.length > 0) {
            settings.filters.forEach(function(filter) {
                var filterObj = {
                    type: 'subsetter',
                    value_col: filter.value_col || filter,
                    label: filter.label || filter.value_col || filter
                };
                controlInputs.push(filterObj);
            });
        }
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
            .values();

        this.nested_data = d3
            .nest()
            .key(function(d) {
                return d[config.id_col];
            })
            .entries(this.raw_data);

        this.nested_data.forEach(function(id) {
            id.all_dates = config.all_times.map(function(time) {
                var match = id.values.filter(function(d) {
                    return d[config.time_col] == time;
                });
                var prev = id.values.filter(function(d) {
                    return d[config.time_col] == time - 1;
                });
                var shell = {
                    id: id.key,
                    time: time,
                    value: match.length > 0 ? match[0][config.value_col] : null
                };
                config.values.forEach(function(val_name) {
                    shell[val_name + '_raw'] = match.length > 0 ? match[0][val_name] : null; //todays cumulative count
                    shell[val_name + '_prev'] = prev.length > 0 ? prev[0][val_name] : null; //yesterday's cumulative count
                    shell[val_name] = +shell[val_name + '_raw'] - +shell[val_name + '_prev']; // new today cases
                });
                return shell;
            });
            //get totals
            config.values.forEach(function(val_name) {
                id[val_name + '_total'] = d3.max(id.values, function(d) {
                    return d[val_name];
                })
                    ? d3.max(id.values, function(d) {
                          return d[val_name];
                      })
                    : 0;
            });
        });
        console.log(this.nested_data);
    }

    function onInit() {
        dataPrep.call(this);
    }

    function onLayout() {
        this.wrap
            .append('div')
            .append('small')
            .text('Click a line to see details');
    }

    function onPreprocess() {
        chart.listing.draw([]);
        chart.listing.wrap.style('display', 'none');
    }

    function onDatatransform() {}

    function makeWaffle() {
        var chart = this;
        var config = this.config;
        var waffle = this.waffle;

        waffle.wrap.selectAll('*').remove();
        config.max_cut = 1000;

        // color scale
        var colorScale = d3.scale
            .linear()
            //.domain(d3.extent(chart.raw_data, d => d[config.value_col]))
            .domain([1, config.max_cut])
            .range(['#fee8c8', '#e34a33'])
            .interpolate(d3.interpolateHcl);

        // draw the waffle chart
        waffle.table = waffle.wrap.append('table').style('border-collapse', 'collapse');

        waffle.head = waffle.table.append('thead').append('tr');
        waffle.head
            .append('th')
            .attr('class', 'th-id')
            .text('State')
            .style('text-align', 'left');

        var start_date = d3.time.format('%Y%m%d').parse(d3.min(config.all_times));
        var start_datef = d3.time.format('%d%b')(start_date);
        var end_date = d3.time.format('%Y%m%d').parse(d3.max(config.all_times));
        var end_datef = d3.time.format('%d%b')(end_date);
        waffle.head
            .append('th')
            .attr('class', 'th-start')
            .attr('colspan', Math.floor(config.all_times.length / 2))
            .style('text-align', 'left')
            .style('border-left', '1px solid #ccc')
            .style('padding-left', '0.2em')
            .html(start_datef + '&#x2192;');
        waffle.head
            .append('th')
            .attr('class', 'th-end')
            .attr('colspan', Math.ceil(config.all_times.length / 2))
            .style('text-align', 'right')
            .style('border-right', '1px solid #ccc')
            .style('padding-right', '0.2em')
            .html('&#x2190;' + end_datef);

        waffle.tbody = waffle.table.append('tbody');
        waffle.rows = waffle.tbody
            .selectAll('tr')
            .data(chart.nested_data)
            .enter()
            .append('tr');

        waffle.rows
            .append('td')
            .attr('class', 'id')
            .text(function(d) {
                return d.key;
            });

        waffle.rows
            .selectAll('td.values')
            .data(function(d) {
                return d.all_dates;
            })
            .enter()
            .append('td')
            .attr('class', 'values')
            .text(function(d) {
                return !config.show_values
                    ? ''
                    : d[config.value_col] == null
                    ? ''
                    : d[config.value_col];
            })
            .style('width', '10px')
            .attr('title', function(d) {
                return (
                    config.time_col +
                    ':' +
                    d.time +
                    '\n' +
                    config.value_col +
                    ':' +
                    d[config.value_col] +
                    '\n' +
                    config.id_col +
                    ':' +
                    d.id
                );
            })
            .style('background', function(d) {
                return d[config.value_col] == null
                    ? 'white'
                    : d[config.value_col] == 0
                    ? 'white'
                    : d[config.value_col] < 1000
                    ? colorScale(d[config.value_col])
                    : '#e34a33';
            })
            .style('font-size', '0.6em')
            .style('padding', '0 0.2em')
            .style('color', '#333')
            .style('text-align', 'center')
            .style('cursor', 'pointer')
            .style('border', function(d) {
                return d.value == null ? null : '1px solid #ccc';
            });

        waffle.rows
            .append('td')
            .attr('class', 'total')
            .text(function(d) {
                return d[config.value_col + '_total'];
            })
            .style('padding-left', '.5em');
    }

    function sortNest() {
        var config = this.config;
        this.nested_data.sort(function(a, b) {
            if (config.sort_alpha) {
                return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
            } else {
                var totalcol = config.value_col + '_total';
                return b[totalcol] - a[totalcol];
            }
        });
    }

    function onDraw() {
        sortNest.call(this);
        makeWaffle.call(this);
    }

    function addLineClick() {
        var chart = this;
        var paths = this.marks[0].paths;

        paths
            .on('mouseover', function(d) {
                d3$1.select(this).classed('highlighted', true);
            })
            .on('mouseout', function(d) {
                d3$1.select(this).classed('highlighted', false);
            })
            .on('click', function(d) {
                console.log(d);
                chart.listing.wrap.style('display', null);
                paths.classed('selected', false);
                d3$1.select(this).classed('selected', true);

                var tableData = d.values.map(function(d) {
                    return {
                        ID: d.values.raw[0][chart.config.id_col],
                        Measure: d.values.raw[0][chart.config.measure_col],
                        Visit: d.key,
                        Value: d.values.y
                    };
                });
                chart.listing.draw(tableData);
            });
    }

    function onResize() {
        addLineClick.call(this);
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
