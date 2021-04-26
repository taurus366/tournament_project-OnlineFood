import {html} from '../lib.js';
import {getAllFoods} from '../api/data.js';


const catalogTemplate = (foods) => html`
    <section id="article-feed">
        <h1>Каталог</h1>
        <div id="articles">
            <!-- Display : All articles in database ( If any ) -->
            ${foods === null ? html`<p class="no-articles">Все още нямаме храна за
                позказване.</p>` : foods.map(articleTemplate)}
            <!-- Display : If there are no articles in database -->

        </div>
    </section>
`;

const articleTemplate = (food) => html`
    <div class="article">
        <div class="card">
            <div class="info">
                <p class="article-title">${food.name}</p>
                <img class="article-image" alt="article-img" src=${food.imageUrl}>
            </div>
            <div id="data-buttons">
                <a class="button" href="/details/${food.id}">Детайли</a>
            </div>
        </div>
    </div>
`;


export async function catalogPage(context) {
    //const response = await fetch('http://localhost:3000/datas/catalog.json');
  //  const foods = await response.json();

    let foods = null;
    try {
        foods = await getAllFoods();

    }catch (e) {

    }
    context.render(catalogTemplate(foods));




}