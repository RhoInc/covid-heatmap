export default function sortNest() {
    let config = this.config;
    this.nested_data.sort(function(a, b) {
        if (config.sort_alpha) {
            return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
        } else {
            let totalcol =
                config.values.filter(function(f) {
                    return config.value_labels.indexOf(f.label) > -1;
                })[0]['col'] + '_total';
            return b.values[totalcol] - a.values[totalcol];
        }
    });
}
