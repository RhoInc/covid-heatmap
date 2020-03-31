import { isBoolean } from 'util';

export default function dataPrep() {
    let config = this.config;
    config.all_times = d3
        .set(this.raw_data.map(d => d[config.time_col]))
        .values()
        .map(m => +m);

    this.nested_data = d3
        .nest()
        .key(d => d[config.id_col])
        .rollup(function(d) {
            let obj = {};
            obj.raw = d;
            obj.dates = d.map(m => m[config.time_col]);

            //fill in dates with no data collected
            config.all_times.forEach(function(date) {
                if (obj.dates.indexOf(date) == -1) {
                    let shell = {};
                    shell[config.id_col] = d[0][config.id_col];
                    shell[config.time_col] = date;
                    config.values.forEach(function(val) {
                        shell[val.col] = null;
                    });
                    obj.raw.push(shell);
                }
            });
            obj.raw.sort(function(a, b) {
                return a[config.time_col] - b[config.time_col];
            });

            //calculate value_col totals for each id
            config.values.forEach(function(val_name) {
                obj[val_name.col + '_total'] = d3.sum(d, d => d[val_name.col]);
            });
            return obj;
        })
        .entries(this.raw_data);
    console.log(this.nested_data);
}
