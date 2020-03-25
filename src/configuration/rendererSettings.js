export default function rendererSettings() {
    return {
        id_col: 'state',
        time_col: 'date',
        value_col: 'positive',
        show_values: false,
        sort_alpha: false,
        values: ['positive', 'total', 'hospitalized', 'death'],
        filters: [] //updated in sync settings
    };
}
