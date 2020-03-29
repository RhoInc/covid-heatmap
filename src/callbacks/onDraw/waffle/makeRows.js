export default function makeRows(value) {
    let config = this.config;

    var colorScale = d3.scale
        .linear()
        .domain([1, value.max_cut])
        .range(value.colors)
        .interpolate(d3.interpolateHcl);

    this.waffle.rows
        .selectAll('td.values.' + value.col)
        .data(d => d.all_dates)
        .enter()
        .append('td')
        .attr('class', 'values ' + value.col)
        .text(d => (!config.show_values ? '' : d.data_reported ? d[value.col] : ''))
        .style('width', '6px')
        .attr(
            'title',
            d =>
                config.id_col +
                ':' +
                d.id +
                '\n' +
                config.time_col +
                ':' +
                d.time +
                '\n' +
                value.label +
                ':' +
                d[value.col]
        )
        .style('background', d =>
            d[value.col] == null
                ? 'white'
                : d[value.col] == 0
                ? 'white'
                : d[value.col] < value.max_cut
                ? colorScale(d[value.col])
                : value.colors[1]
        )
        .style('display', d => (d.hidden ? 'none' : null))
        .style('font-size', '0.6em')
        .style('padding', '0 0.2em')
        .style('color', '#333')
        .style('text-align', 'center')
        .style('cursor', 'pointer')
        .style('border', d => (d.data_reported ? '1px solid #ccc' : null));

    this.waffle.rows
        .append('td')
        .attr('class', 'total')
        .text(d => d[value.col + '_total'])
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
