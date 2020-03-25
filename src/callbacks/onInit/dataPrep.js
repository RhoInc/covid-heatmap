export default function dataPrep() {
    let config = this.config;
    config.all_times = d3.set(this.raw_data.map(d => d[config.time_col])).values();

    this.nested_data = d3
        .nest()
        .key(d => d[config.id_col])
        .entries(this.raw_data);

    this.nested_data.forEach(function(id) {
        id.all_dates = config.all_times.map(function(time) {
            let match = id.values.filter(d => d[config.time_col] == time);
            let prev = id.values.filter(d => d[config.time_col] == time - 1);
            let shell = {
                id: id.key,
                time: time,
                value: match.length > 0 ? match[0][config.value_col] : null
            };
            config.values.forEach(function(val_name) {
                shell[val_name + '_raw'] = match.length > 0 ? match[0][val_name] : null; //todays cumulative count
                shell[val_name + '_prev'] = prev.length > 0 ? prev[0][val_name] : null; //yesterday's cumulative count
                shell[val_name] = +shell[val_name + '_raw'] - +shell[val_name + '_prev']; // new today cases
            });
            return shell;
        });
        //get totals
        config.values.forEach(function(val_name) {
            id[val_name + '_total'] = d3.max(id.values, d => d[val_name])
                ? d3.max(id.values, d => d[val_name])
                : 0;
        });
    });
    console.log(this.nested_data);
}
