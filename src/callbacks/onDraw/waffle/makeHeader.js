export default function makeHeader(value) {
    let config = this.config;
    let start_date = d3.time.format('%Y%m%d').parse('' + d3.min(config.all_times));
    let start_datef = d3.time.format('%d%b')(start_date);
    let end_date = d3.time.format('%Y%m%d').parse('' + d3.max(config.all_times));
    let end_datef = d3.time.format('%d%b')(end_date);

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
