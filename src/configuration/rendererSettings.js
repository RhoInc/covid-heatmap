export default function rendererSettings() {
    return {
        id_col: 'state',
        time_col: 'date',
        value_labels: ['Tests', 'Positives', 'Hospital', 'Deaths'],
        show_values: false,
        sort_alpha: false,
        show_days: 14,
        values: [
            { col: 'total', label: 'Tests', colors: ['#e5f5f9', '#2ca25f'] },
            { col: 'positive', label: 'Positives', colors: ['#efedf5', '#756bb1'] },
            { col: 'hospitalized', label: 'Hospital', colors: ['#fee8c8', '#e34a33'] },
            { col: 'death', label: 'Deaths', colors: ['#fee0d2', '#de2d26'] }
        ]
    };
}
