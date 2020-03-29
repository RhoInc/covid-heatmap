import makeWaffle from './onDraw/waffle/makeWaffle';
import sortNest from './onDraw/sortNest';
import flagDates from './onDraw/flagDates';

export default function onDraw() {
    sortNest.call(this);
    flagDates.call(this);
    makeWaffle.call(this);
}
