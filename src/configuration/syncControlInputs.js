export default function syncControlInputs(controlInputs, settings) {
    //Add filters to default controls.
    let outcomeControl = controlInputs.find(f => f.label == 'Outcome');
    outcomeControl.values = settings.values.map(m => m.label);
    outcomeControl.start = settings.value_labels;
    return controlInputs;
}
