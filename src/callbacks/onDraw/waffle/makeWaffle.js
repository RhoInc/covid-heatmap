import makeHeader from './makeHeader';
import makeRows from './makeRows';
import waffleClick from './waffleClick';

export default function makeWaffle() {
    let chart = this;
    let config = this.config;
    let waffle = this.waffle;

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
        .append('tr')
        .style('height', d =>
            config.id_selected == 'All' || config.id_selected == d.key ? '15' : '3'
        )
        .style('font-size', d =>
            config.id_selected == 'All' || config.id_selected == d.key ? null : '0'
        );

    waffle.rows
        .append('td')
        .attr('class', 'id')
        .style('font-weight', 'lighter')
        .style('font-size', '0.8em')
        .text(d => d.key);

    waffle.rows
        .on('mouseover', function(d) {
            d3.select(this)
                .style('font-weight', '900')
                .style('color', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .style('font-weight', 'lighter')
                .style('color', '#333');
        })
        .on('click', function(d) {
            config.id_selected = d.key;
            chart.controls.wrap
                .selectAll('div.control-group')
                .filter(function(d) {
                    return d.label == 'Select State';
                })
                .select('select')
                .selectAll('option')
                .property('selected', d => d == config.id_selected);
            chart.draw();
        });

    let values = config.values.filter(f => config.value_labels.indexOf(f.label) > -1);
    values.forEach(function(value) {
        makeHeader.call(chart, value);
        makeRows.call(chart, value);
    });
}
