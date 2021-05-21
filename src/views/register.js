import {html,until} from '../lib.js';
import {register} from '../api/data.js';
import {loaderTemplate} from '../common/loader.js';

const registerTemplate = (onSubmit) => html`
    ${until(loadRegister(onSubmit),loaderTemplate())}
`;

async function loadRegister(onSubmit) {
    return html`
        <section id="register">
            <form @submit=${onSubmit} id="register-form">
                <div class="container">
                    <h1>Регистрация</h1>
                    <label for="username">Потребителско име</label>
                    <input id="username" type="text" placeholder="Потребителско име на латиница!" name="username">
                    <label for="password">Парола</label>
                    <input id="password" type="password" placeholder="парола" name="password">
                    <label for="repeatPass">Повторете паролата</label>
                    <input id="repeatPass" type="password" placeholder="повторете паролата" name="repeatPass">
                    <label for="phoneNumber">Телефонен номер</label>
                    <input id="phoneNumber" type="number" placeholder="089/8" name="phoneNumber">
                    <label for="address">Адрес</label>
                    <input id="address" type="text" placeholder="населено място/ ул." name="address">
                    <label for="names">Име за доставка</label>
                    <input id="names" type="text" placeholder="Име и фамилия" name="names">
                    <input type="submit" class="registerbtn button" value="Регистрирай">
                    <div class="container signin">
                        <p>Вече имате профил?<a href="/login">Влез</a></p>
                    </div>
                </div>
            </form>
        </section>
    `;
}

export async function registerPage(context) {

    await  context.render(registerTemplate(onSubmit));

    async function onSubmit(ev){
    ev.preventDefault();

    try {
        const formData = new FormData(ev.target);
        const username = formData.get('username').trim();
        const password = formData.get('password');
        const rePass = formData.get('repeatPass');
        const address = formData.get('address').trim();
        const fullName = formData.get('names').trim();
        const phoneNumber = formData.get('phoneNumber').trim();




        if (username.length === 0 || password.length ===0 || rePass.length === 0 || address.length === 0 || fullName.length === 0){
            throw new Error('Всички полета са задължителни.');
        }
        if (password !== rePass){
            throw new Error('Паролите не съвпадат.');
        }
        if (phoneNumber.length !== 10 || !phoneNumber.match('1?-?\\(?[0]{1}[8]{1}[8|9]{1}[0-9]{5}')){
            throw new Error('грешен телефонен номер!');
        }
        if (!fullName.match('^[a-zA-Z |а-яА-Я]+$')){
            throw new Error('Име за доставка : не е позволено да се пише цифри!');
        }

       await register(username,password,address,fullName,phoneNumber);
        context.setUserNav();
        context.page.redirect('/catalog');
        setTimeout(() =>{
            location.reload();
        },1000);

    }catch (e) {
        notify(e.message);
    }

    }
}