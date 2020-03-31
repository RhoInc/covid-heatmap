export default function makeRows(value) {
    let config = this.config;

    var colorScale = d3.scale
        .linear()
        .domain([1, value.max_cut])
        .range(value.colors)
        .interpolate(d3.interpolateHcl);

    var logScale = d3.scale
        .log()
        .domain([1, value.max_val])
        .range([0, 100]);

    let td_values = this.waffle.rows
        .selectAll('td.values.' + value.col)
        .data(d => d.values.raw)
        .enter()
        .append('td')
        .attr('class', 'values ' + value.col)
        .text(d => (config.show_values ? d[value.col] : ''))
        .style('width', '10px')
        .style('height', '15px')
        .attr('title', d =>
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
                d[value.col] ==
            null
                ? 'Not Collected'
                : d[value.col]
        )
        .style('display', d => (d.hidden ? 'none' : null))
        .style('font-size', '0.6em')
        //.style('padding', '0 0.2em')
        .style('color', '#333')
        .style('text-align', 'center')
        .style('cursor', 'pointer')
        // .style('border', d => (d[value.col] == null ? null : '1px solid #ccc'))
        //  .append('div')
        //  .style('width', '10px')
        //  .style('height', '15px')
        .style('background', function(d) {
            let color =
                d[value.col] == null
                    ? '#eee'
                    : d[value.col] == 0
                    ? 'white'
                    : d[value.col] < value.max_cut
                    ? colorScale(d[value.col])
                    : value.colors[1];
            let percent = logScale(d[value.col]);
            let gradient =
                'linear-gradient(to top, ' + color + ' ' + percent + '%, white ' + percent + '%)';
            return config.show_bars ? gradient : color;
        });

    this.waffle.rows
        .append('td')
        .attr('class', 'total')
        .text(d => d.values[value.col + '_total'])
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
