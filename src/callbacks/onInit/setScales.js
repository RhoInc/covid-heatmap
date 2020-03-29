export default function setScales() {
    let chart = this;
    this.config.values.forEach(function(value) {
        let max_val = d3.max(chart.nested_data, function(state) {
            return d3.max(state.all_dates, d => d[value.col]);
        });
        let power_of_10 = ('' + max_val).length;
        value.max_cut = 10 ** (power_of_10 - 1);
    });
}
