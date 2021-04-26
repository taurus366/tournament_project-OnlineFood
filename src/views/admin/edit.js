import {html,until} from '../../lib.js';
import {getFoodById,editFood} from '../../api/data.js';
import {loaderTemplate} from '../../common/loader.js';

const editFoodTemplate = (food,onSubmit) => html`
        ${until(loadEditForm(food,onSubmit),loaderTemplate())}
`;

async function loadEditForm(food,onSubmit) {
    return html`
      <section id="edit-article">
        <form @submit=${onSubmit} id="edit-form">
            <h1>Промяна на Артикула</h1>
            <div class="container">
                <label for="title">Име</label>
                <input id="title" type="text" placeholder="Име" name="title" .value=${food.name}>
                <label for="description">Относно</label>
                <textarea id="description" placeholder="Относно" name="description">
                            ${food.description.trim()}
                        </textarea>
                <label for="imageUrl">Снима линк</label>
                <input id="imageUrl" type="text" placeholder="Линк към снимка" name="imageUrl" .value=${food.imageUrl}>
                <label for="price">Цена</label>
                <input id="price" type="text" placeholder="Цена" name="price" .value=${food.price.toFixed(2)}>
                <input type="submit" class="registerbtn button" value="Запази промените" style="display:">
            </div>
        </form>
    </section>
    `;
}

export async function editFoodPage(context) {
        const foodId = context.params.id;
        console.log(foodId);
     const food = await getFoodById(foodId);
    context.render(editFoodTemplate(food,onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();

        const formData = new FormData(ev.target);
        const name = formData.get('title');
        const description = formData.get('description');
        const imageUrl = formData.get('imageUrl');
        const price = formData.get('price');

      try {
          if (name.length === 0 || description.length === 0 || imageUrl.length === 0 || price.length === 0){
              throw new Error('Всички полета са задължителни.');
          }
          food.name = name;
          food.description = description.trim();
          food.imageUrl = imageUrl;
          food.price = parseFloat(price).toFixed(2);

       notify( await editFood({"name":name,"imageUrl":imageUrl,"id":foodId,"description":description,"price":price}));
        context.page.redirect('/catalog');
      }catch (e) {
          notify(e.message);
      }


    }

}