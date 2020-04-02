import { isBoolean } from 'util';

export default function dataPrep() {
    let config = this.config;

    //parse time to js date format
    config.all_times = d3
        .set(this.raw_data.map(d => d[config.time_col]))
        .values()
        .map(function(m) {
            let timeobj = {};
            timeobj.raw = m;
            timeobj.date = d3.time.format(config.time_format).parse(m);
            timeobj.short = d3.time.format('%d%b')(timeobj.date);
            timeobj.n = +d3.time.format('%Y%m%d')(timeobj.date);
            return timeobj;
        })
        .sort(function(a, b) {
            return a.n - b.n;
        });
    config.show_days = config.all_times.length;

    this.raw_data = this.raw_data.map(function(m) {
        m[config.time_col + '_date'] = d3.time
            .format(config.time_format)
            .parse('' + m[config.time_col]);
        m[config.time_col + '_short'] = d3.time.format('%d%b')(m[config.time_col + '_date']);
        m[config.time_col + '_n'] = +d3.time.format('%Y%m%d')(m[config.time_col + '_date']);

        return m;
    });

    this.nested_data = d3
        .nest()
        .key(d => d[config.id_col])
        .rollup(function(d) {
            let obj = {};
            obj.raw = d;
            obj.dates = d.map(m => m[config.time_col + '_short']);

            //fill in dates with no data collected
            config.all_times.forEach(function(date) {
                if (obj.dates.indexOf(date.short) == -1) {
                    let shell = {};
                    shell[config.id_col] = d[0][config.id_col];
                    shell[config.time_col + '_data'] = date.date;
                    shell[config.time_col + '_short'] = date.short;
                    shell[config.time_col + '_n'] = date.n;
                    config.values.forEach(function(val) {
                        shell[val.col] = null;
                    });
                    obj.raw.push(shell);
                }
            });
            obj.raw.sort(function(a, b) {
                return a[config.time_col + '_n'] - b[config.time_col + '_n'];
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
