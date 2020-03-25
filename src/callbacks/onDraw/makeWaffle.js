export default function makeWaffle() {
    let chart = this;
    let config = this.config;
    let waffle = this.waffle;

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

    let start_date = d3.time.format('%Y%m%d').parse(d3.min(config.all_times));
    let start_datef = d3.time.format('%d%b')(start_date);
    let end_date = d3.time.format('%Y%m%d').parse(d3.max(config.all_times));
    let end_datef = d3.time.format('%d%b')(end_date);
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
        .text(d => d.key);

    waffle.rows
        .selectAll('td.values')
        .data(d => d.all_dates)
        .enter()
        .append('td')
        .attr('class', 'values')
        .text(d =>
            !config.show_values ? '' : d[config.value_col] == null ? '' : d[config.value_col]
        )
        .style('width', '10px')
        .attr(
            'title',
            d =>
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
        )
        .style('background', d =>
            d[config.value_col] == null
                ? 'white'
                : d[config.value_col] == 0
                ? 'white'
                : d[config.value_col] < 1000
                ? colorScale(d[config.value_col])
                : '#e34a33'
        )
        .style('font-size', '0.6em')
        .style('padding', '0 0.2em')
        .style('color', '#333')
        .style('text-align', 'center')
        .style('cursor', 'pointer')
        .style('border', d => (d.value == null ? null : '1px solid #ccc'));

    waffle.rows
        .append('td')
        .attr('class', 'total')
        .text(d => d[config.value_col + '_total'])
        .style('padding-left', '.5em');
}
