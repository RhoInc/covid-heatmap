import makeWaffle from './onDraw/makeWaffle';
import sortNest from './onDraw/sortNest';

export default function onDraw() {
    sortNest.call(this);
    makeWaffle.call(this);
}
