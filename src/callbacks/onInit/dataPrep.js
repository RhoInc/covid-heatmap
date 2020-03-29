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
                data_reported: match.length > 0
            };
            config.values.forEach(function(val_name) {
                shell[val_name.col + '_raw'] = match.length > 0 ? match[0][val_name.col] : null; //todays cumulative count
                shell[val_name.col + '_prev'] = prev.length > 0 ? prev[0][val_name.col] : null; //yesterday's cumulative count
                shell[val_name.col] = shell[val_name.col + '_raw'] - shell[val_name.col + '_prev']; // new today cases
            });
            return shell;
        });
        //get totals
        config.values.forEach(function(val_name) {
            id[val_name.col + '_total'] = d3.max(id.values, d => d[val_name.col])
                ? d3.max(id.values, d => d[val_name.col])
                : 0;
        });
    });
    console.log(this.nested_data);
}
