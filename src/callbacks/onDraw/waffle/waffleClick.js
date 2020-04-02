export default function waffleClick(row, d) {
    console.log('clicked');
    console.log(d);
    console.log(row);

    let config = this.config;
    config.id_selected = d.key;

    //shrink other rows
    chart.waffle.rows
        .style('height', '3')
        .style('font-size', '0')
        .selectAll('td')
        .style('height', '3');
    row.style('height', null).style('font-size', null);
}
