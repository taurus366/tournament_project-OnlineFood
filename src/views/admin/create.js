import {html,until} from '../../lib.js';
import {postFood} from '../../api/data.js';
import {loaderTemplate} from '../../common/loader.js';

const createTemplate = (onSubmit) => html`
   ${until(loadCreate(onSubmit),loaderTemplate())}
`;

async function loadCreate(onSubmit) {
    return html`
        <section id="create-article">
            <form @submit=${onSubmit} id="create-form">
                <div class="container">
                    <h1>Добавяне на нов продукт</h1>
                    <label for="title">Име</label>
                    <input id="title" type="text" placeholder="Име" name="title">
                    <label for="description">Относно</label>
                    <textarea id="description" placeholder="Относно" style="resize: none" maxlength="230" name="description"></textarea>
                    <label for="imageUrl">Линк към снимката</label>
                    <input id="imageUrl" type="text" placeholder="линк към снимката" name="imageUrl">
                    <label for="price">Цена</label>
                    <input id="price" type="text" placeholder="напр. 2.00" name="price">
                    <input type="submit" class="registerbtn button" value="Create Article">
                </div>
            </form>
        </section>
    `;
}

export async function createPage(context) {
    context.render(createTemplate(onSubmit));
    async function onSubmit(ev) {
        ev.preventDefault();
        console.log('test')
        const formData = new FormData(ev.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const imageUrl = formData.get('imageUrl');
        const price = formData.get('price');
        const userId = sessionStorage.getItem('userId');

        try {
            if (title.length === 0 || description.length === 0 || imageUrl.length === 0 || price.length === 0) {
                throw new Error('Всички полета са задължителни');
            }

            await postFood({
                "name":title,
                description,
                imageUrl,
                price,
                "id":userId
            })
            context.page.redirect('/catalog');
        } catch (e) {
            notify(e.message);
        }


    }


}