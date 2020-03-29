export default function flagDates() {
    let config = this.config;
    let day_control = this.controls.wrap.selectAll('div.control-group').filter(function(d) {
        return d.label == 'Days Shown';
    });

    //don't allow show_days > # of days of data
    if (config.show_days > config.all_times.length) {
        config.show_days = config.all_times.length;
        day_control.select('input').property('value', config.show_days);
    }

    //Flag hidden dates in nested data
    let date_count = this.config.all_times.length;
    let visible_after = date_count - this.config.show_days;
    this.nested_data.forEach(function(state) {
        state.all_dates.forEach(function(date, i) {
            date.hidden = i < visible_after;
        });
    });

    //show the date range in the control
    let end_date_n = d3.max(config.all_times);
    let end_date = d3.time.format('%Y%m%d').parse(end_date_n);

    let end_datef = d3.time.format('%d%b')(end_date);
    let start_date = d3.time.day.offset(end_date, -1 * config.show_days);
    let start_datef = d3.time.format('%d%b')(start_date);

    day_control.select('span.span-description').text(start_datef + '-' + end_datef);
}
