const item = document.querySelector('#notifications > #errorBox');

export function notify(message) {

    item.querySelector('span').textContent = message;
    item.style.display = 'block';

    setTimeout(() =>{
        item.style.display = 'none';
    },5000)
}
window.notify = notify;