export default function updateIdControl() {
    this.config.ids = this.nested_data.map(m => m.key);
    this.controls.config.inputs.find(f => f.label == 'Select State').values == this.config.ids;
    this.controls.wrap.selectAll('div');
    let options = this.controls.wrap
        .selectAll('div.control-group')
        .filter(function(d) {
            return d.label == 'Select State';
        })
        .select('select')
        .selectAll('option');

    options
        .data(d3.merge([['All'], this.config.ids]))
        .enter()
        .append('option')
        .text(d => d);
}
