export default function selectOutcomes() {
    let config = this.config;
    this.controls.wrap
        .selectAll('div.control-group')
        .filter(function(d) {
            return d.label == 'Outcome';
        })
        .select('select')
        .selectAll('option')
        .attr('selected', d => (config.value_labels.indexOf(d) > -1 ? 'selected' : null));
}
