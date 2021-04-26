import {html} from '../lib.js';
import {login} from '../api/data.js';
const loginTemplate = (onSubmit) => html`
    <section id="login">
        <form @submit=${onSubmit} id="login-form">
            <div class="container">
                <h1>Влез</h1>
                <label for="username">Потребителско име</label>
                <input id="username"  name="username" placeholder="потребителско име" type="text">
                <label for="password">Парола</label>
                <input id="password" type="password" placeholder="парола" name="password">
                <input type="submit" class="registerbtn button" value="Влез">
                <div class="container signin">
                    <p>Нямате профил? <a href="/register">Регистрирай се</a>.</p>
                </div>
            </div>
        </form>
    </section>
`;

export async function loginPage(context) {
    context.render(loginTemplate(onSubmit));
    async function onSubmit(ev) {
        ev.preventDefault();
       // console.log('test');
        const formData = new FormData(ev.target);
        const username = formData.get('username');
        const password = formData.get('password');

      try {
          await login(username,password);
          context.setUserNav();

        await context.page.redirect('/catalog');
          setTimeout(() =>{
              location.reload();
          },1000);

      }catch (e){
         notify(e.message);
      }

    }
}