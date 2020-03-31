// Deprecated for now & Not being used - Could be adapted to munge cumulative data, but count data is strongly preferred

// getDailyCounts() is a helper function to convert from cumulative cases to daily cases
// cumulative_counts should be one record per id_col per time_col
// time_col will be used to sort the data by date (for now, make it numeric)
// value_cols is an array of values (deaths, cases, hosptializations, etc), which should be cumulative event counts for each id/value pair up to the given date
// expecting value_col == null for days with no reports vs value_col = 0 for days with 0 events reported

function getDailyCounts(cumulative_counts, time_col, id_col, value_cols) {
    // List of all times in the raw data
    let all_times = d3.set(cumulative_counts.map(d => +d[time_col])).values();

    // nest to 1 record per id
    let nested_data = d3
        .nest()
        .key(d => d[id_col])
        .sortValues(function(a, b) {
            return b[time_col] - a[time_col];
        })
        .entries(cumulative_counts);

    nested_data.forEach(function(id) {
        id.all_times = all_times.map(function(time) {
            let today = id.values.find(f => f[time_col] == time);
            console.log(today);
            let previousDays = id.values.filter(f => f[time_col] < time);
            let shell = {};
            shell[id_col] = id.key;
            shell[time_col] = +time;
            //get the daily count for each specified value
            value_cols.forEach(function(value_col) {
                let reported = today ? today[value_col] !== null > 0 : false; //flag for whether value was reported on the specified day
                let today_cumulative = reported ? today[value_col] : null;
                let previousValues = previousDays
                    .filter(f => f[value_col] != null)
                    .map(f => f[value_col]);
                let previous_cumulative =
                    previousValues.length > 0 ? previousValues[previousValues.length - 1] : 0;
                console.log(today_cumulative, ' - ', previous_cumulative);
                shell[value_col] = reported ? today_cumulative - previous_cumulative : null;
            });
            return shell;
        });
    });
    let count_data = d3.merge(nested_data.map(m => m.all_times));
    return count_data;
}
