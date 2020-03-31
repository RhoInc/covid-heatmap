export default function setScales() {
    let chart = this;
    this.config.values.forEach(function(value) {
        value.max_val = d3.max(chart.nested_data, function(state) {
            console.log(state);
            return d3.max(state.values.raw, d => d[value.col]);
        });
        let power_of_10 = ('' + value.max_val).length;
        value.max_cut = 10 ** (power_of_10 - 1);
    });
}
