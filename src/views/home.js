import {html,until} from '../lib.js';
import {loaderTemplate} from '../common/loader.js';

async function loadHome() {
    return html`
        <section id="welcome">
            <div id="welcome-container">
                <h1>Добре дошли</h1>
                <img src="/src/images/kebab.jpg" alt="article">
                <h2>Трябва да влезете в системата за да поръчате!</h2>
                <div id="button-div">
                    <a href="/login" class="button">Влез</a>
                    <a href="/register" class="button">Регистрирай се</a>
                    <a href="/" class="button">Поръчай без регистрация</a>
                </div>
            </div>
        </section>
    `;
}

const homeTemplate = () => html`
    ${until(loadHome(),loaderTemplate())}
`;

export async function homePage(context) {
   await context.render(homeTemplate());
}