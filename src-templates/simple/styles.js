export default function styles() {
    const styles = [
    ];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);
}
