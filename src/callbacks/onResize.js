import addLineClick from './onResize/addLineClick';

export default function onResize() {
    addLineClick.call(this);
    this.wrap.style('display', 'none');
}
