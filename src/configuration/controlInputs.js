export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'Outcome',
            option: 'value_col',
            require: true
        },
        {
            type: 'checkbox',
            label: 'Show Raw Values',
            option: 'show_values',
            require: true
        }
    ];
}
