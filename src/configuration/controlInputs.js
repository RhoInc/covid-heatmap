export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'Outcome',
            option: 'value_labels',
            multiple: true,
            values: null,
            require: true
        },
        {
            type: 'number',
            label: 'Days Shown',
            option: 'show_days',
            require: true
        },
        {
            type: 'checkbox',
            label: 'Show Raw Values',
            option: 'show_values',
            require: true
        },
        ,
        {
            type: 'checkbox',
            label: 'Sort Alphabetical',
            option: 'sort_alpha',
            require: true
        }
    ];
}
