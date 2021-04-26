import {html,until} from '../lib.js';
import {editProfile} from '../api/data.js';
import {loaderTemplate} from '../common/loader.js';
const profileTemplate = (username,address,fullName,phoneNumber,onSubmit) => html`

    ${until(loadProfile(username,address,fullName,phoneNumber,onSubmit),loaderTemplate())}
    
    
`;
async function loadProfile(username,address,fullName,phoneNumber,onSubmit) {
    return html`
    <section id="user-profile-page" class="user-profile">
        <div class="user-content">
            <p><i class="fas fa-user"></i> Потребителско име:<p id="client">${username}</p></p>
            <p><i class="fas fa-address-card"></i> Адрес за доставка:<p id="client">${address}</p></p>
            <p><i class="fas fa-address-card"></i> Име за доставка:<p id="client">${fullName}</p></p>
            <p><i class="fa fa-phone"></i> Телефонен номер:<p id="client">${phoneNumber}</p></p>
        </div>
        <h1 id="user-listings-title"></h1>
        <section id="register">
            <form @submit=${onSubmit} id="register-form">
                <div class="container">
                    <h1>Настройки на профила</h1>
                    <label for="address">Адрес</label>
                    <input id="address" type="text" placeholder="населено място/ ул." name="address">
                    <label for="fullName">Име за доставка</label>
                    <input id="fullName" type="text" placeholder="Име и фамилия" name="fullName">
                    <label for="phoneNumber">Телефонен номер</label>
                    <input id="phoneNumber" type="text" placeholder="089/8" name="phoneNumber">
                    <input type="submit" class="registerbtn button" value="Запази">
                </div>
            </form>
        </section>
    </section>
    `;
}

export async function profilePage(context) {
    const username = sessionStorage.getItem('username');
    const address = sessionStorage.getItem("address");
    const fullName = sessionStorage.getItem("fullName");
    const phoneNumber = sessionStorage.getItem("phoneNumber");

    await  context.render(profileTemplate(username,address,fullName,phoneNumber,onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();



        let settings = {'session':{'authToken':sessionStorage.getItem('authToken')},
        "id":sessionStorage.getItem('userId')};

        const formData = new FormData(ev.target);
        const address = formData.get('address');
        const fullName = formData.get('fullName');
        const phoneNumber = formData.get('phoneNumber');

        if (address.length > 0){
            settings.address = address;
        }
        if (fullName.length > 0){
            settings.fullName = fullName;
        }
        if (phoneNumber.length > 0){
            settings.phoneNumber = phoneNumber;
        }

        try {
            if (phoneNumber.length !== 10 || !phoneNumber.match('1?-?\\(?[0]{1}[8]{1}[8|9]{1}[0-9]{5}')){
                throw new Error('грешен телефонен номер!');
            }
            if (!fullName.match('^[a-zA-Z |а-яА-Я]+$')){
                throw new Error('Име за доставка : не е позволено да се пише цифри!');
            }

            await editProfile(settings);
            context.setUserNav();
            context.page.redirect('/profile');
        }catch (e) {
            notify(e.message);
        }

    }
}