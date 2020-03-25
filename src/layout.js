import { select } from 'd3';

export default function layout(element) {
    const container = select(element);
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
