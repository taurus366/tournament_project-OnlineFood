import {html,until} from '../lib.js';
import {getFoodById,deleteFoodByID,addCart} from '../api/data.js';
import {loaderTemplate} from '../common/loader.js';

const detailTemplate = (isAdmin,onDelete,food,authToken) => html`
        ${until(loadDetail(isAdmin,onDelete,food,authToken),loaderTemplate())}
`;

async function loadDetail(isAdmin,onDelete,food,authToken) {
    return html`
        <section id="details">
            <h1>Име: ${food.name}

            </h1>
            <div class="article-details">
                <div class="article-img">
                    <img alt="article-alt" src=${food.imageUrl}>
                </div>
                <div class="article-description">
                    <h2>Съдържание</h2>
                    <p>
                        ${food.description}
                    </p>

                    ${authToken != null ? isAdmin === 'ADMIN' ? html`
                    <button @click=${onDelete} class="button danger">Изтрий</button>  <a href="/edit/${food.id}"
                                                                                         class="button danger">Промени</a>` : html`
                  
                    <textarea id="comment" maxlength="230" placeholder="Коментар към поръчката" style="resize: none"></textarea>
                    <button class="addCart" class="button danger">Добави в кошницата</button>` : ''}


                </div>

            </div>
        </section>
    `;
}
//  <input id="comment" type="text" placeholder="Коментар към поръчката" name="comment"><br>

export async function detailsPage(context) {



    const isAdmin = sessionStorage.getItem('role');
    const itemId = context.params.id;
    const authToken = sessionStorage.getItem('authToken');

    const food = await getFoodById(itemId);
  await  context.render(detailTemplate(isAdmin,onDelete,food,authToken));

    async function onDelete(ev) {
        console.log('test works');

        const userId  = sessionStorage.getItem('userId');
        const userRole = sessionStorage.getItem('role');

    try {

        notify(await deleteFoodByID(itemId,{'id':userId,'role':userRole}));
        context.page.redirect('/catalog');
    }catch (e) {
        notify(e.message);
    }



    }

    document.querySelector('.addCart').addEventListener('click',async (ev)=>{
        console.log('clicked!')
        const comment = document.getElementById('comment').value;
        notify(await addCart({"comment":comment,"name":food.name,"description":food.description,"id":food.id,"imageUrl":food.imageUrl,"price":food.price,"session":{"authToken":sessionStorage.getItem('authToken')}}));
        context.page.redirect('/catalog');
    })



}