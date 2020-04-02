export default function rendererSettings() {
    return {
        id_col: 'state',
        id_selected: 'All',
        time_col: 'date',
        time_format: '%Y%m%d',
        value_labels: null,
        show_values: false,
        sort_alpha: false,
        show_days: null,
        show_bars: false,
        values: [
            { col: 'deathIncrease', label: 'Deaths', colors: ['#fee0d2', '#de2d26'] },
            { col: 'hospitalizedIncrease', label: 'Hospital', colors: ['#fee8c8', '#e34a33'] },
            { col: 'positiveIncrease', label: 'Positives', colors: ['#efedf5', '#756bb1'] },
            { col: 'totalTestResultsIncrease', label: 'Tests', colors: ['#e5f5f9', '#2ca25f'] }
        ]
    };
}
