export default function webchartsSettings() {
    return {
        x: {
            column: null,
            type: 'linear'
        },
        y: {
            column: null,
            type: 'linear'
        },
        marks: [
            {
                type: 'circle',
                per: null,
            }
        ],
        gridlines: 'xy',
        aspect: 1,
        max_width: 600
    };
}
