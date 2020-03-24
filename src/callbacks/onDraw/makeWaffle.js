export default function makeWaffle() {
    let chart = this;
    let config = this.config;
    let waffle = this.waffle;

    waffle.wrap.selectAll('*').remove();
    config.max_cut = 1000;
    console.log(waffle);

    // color scale
    var colorScale = d3.scale
        .linear()
        //.domain(d3.extent(chart.raw_data, d => d[config.value_col]))
        .domain([0, config.max_cut])
        .range(['green', 'red'])
        .interpolate(d3.interpolateHcl);

    // date list
    let all_times = d3.set(this.raw_data.map(d => d[config.time_col])).values();

    // make a dataset for the waffle chart
    waffle.raw_data = d3
        .nest()
        .key(d => d[config.id_col])
        .entries(this.raw_data);

    waffle.raw_data.forEach(function(id) {
        id.total = d3.sum(id.values, d => d[config.value_col]);
        id.all_dates = all_times.map(function(time) {
            let match = id.values.filter(d => d[config.time_col] == time);
            let shell = {
                id: id.key,
                time: time,
                value: match.length > 0 ? match[0][config.value_col] : null
            };
            return shell;
        });
    });

    waffle.raw_data.sort(function(a, b) {
        if (config.sort_alpha) {
            console.log('alpha');
            return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
        } else {
            console.log('numeric');
            return b.total - a.total;
        }
    });
    console.log(waffle.raw_data);

    // draw the waffle chart
    waffle.table = waffle.wrap.append('table');

    waffle.tbody = waffle.table.append('tbody');
    waffle.rows = waffle.tbody
        .selectAll('tr')
        .data(waffle.raw_data)
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
        .text(d => (config.show_values ? d.value : ''))
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
                d.value +
                '\n' +
                config.id_col +
                ':' +
                d.id
        )
        .style('background', d =>
            d.value == null ? '#ccc' : d.value < 1000 ? colorScale(d.value) : 'red'
        );

    waffle.rows
        .append('td')
        .attr('class', 'total')
        .text(d => d.total);
}
