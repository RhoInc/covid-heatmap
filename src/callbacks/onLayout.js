import selectOutcomes from './onLayout/selectOutcomes';
import updateIdControl from './onLayout/updateIdControl';

export default function onLayout() {
    selectOutcomes.call(this);
    updateIdControl.call(this);
}
