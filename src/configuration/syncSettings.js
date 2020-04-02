export default function syncSettings(settings) {
    // webcharts settings
    settings.value_labels = settings.values.map(m => m.label);
    settings.x.column = settings.time_col;
    settings.y.column = settings.value_col;
    settings.marks[0].per = [settings.id_col];
    return settings;
}
