import dataPrep from './onInit/dataPrep';
import setScales from './onInit/setScales';

export default function onInit() {
    dataPrep.call(this);
    setScales.call(this);
}
