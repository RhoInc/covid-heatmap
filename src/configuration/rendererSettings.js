export default function rendererSettings() {
    return {
        id_col: 'state',
        time_col: 'date',
        value_labels: ['Hospital', 'Deaths'],
        show_values: false,
        sort_alpha: false,
        show_days: 14,
        values: [
            { col: 'deathIncrease', label: 'Deaths', colors: ['#fee0d2', '#de2d26'] },
            { col: 'hospitalizedIncrease', label: 'Hospital', colors: ['#fee8c8', '#e34a33'] },
            { col: 'positiveIncrease', label: 'Positives', colors: ['#efedf5', '#756bb1'] },
            { col: 'totalTestResultsIncrease', label: 'Tests', colors: ['#e5f5f9', '#2ca25f'] }
        ]
    };
}
