export default function sortNest() {
    let config = this.config;
    this.nested_data.sort(function(a, b) {
        if (config.sort_alpha) {
            return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
        } else {
            let totalcol = config.value_col + '_total';
            return b[totalcol] - a[totalcol];
        }
    });
}
