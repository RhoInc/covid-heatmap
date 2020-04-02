export default function makeHeader(value) {
    let config = this.config;
    let start_date = config.all_times[0].short;
    let end_date = config.all_times[config.all_times.length - 1].short;

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
        .html('&#x2190;' + end_date);

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
