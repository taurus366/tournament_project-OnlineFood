import {html,until,render} from '../../lib.js';
import {getConfirmedOrdersByDate,getAllConfirmedOrders} from '../../api/data.js';
import {loaderTemplate} from '../../common/loader.js';

const confTemplate = (onClick) => html`
    ${until(loadSelectTemplate(onClick),loaderTemplate())}
    

`;

async function loadSelectTemplate(onClick) {
    const authToken = sessionStorage.getItem('authToken');
    let option = null
   try {
        option = await getAllConfirmedOrders({'authToken':authToken});
   }catch (e) {
       notify(e.message)
   }

     return html`
         <section id="search-turnover-by-day">
             <h1>Филтрирай по дата</h1>

             <div class="container">
                 <form @submit=${onClick}>
                 <select name="date" id="date">
                     ${option.length !== 0 ? option.map(optionTemplate) : html` <option value='empty'>Все още няма приети Поръчки</option>`}
                 </select>
                 <input type="submit" class="button  search" value="Търси">
                 </form>
             </div>
             </section>
         <div id="table">
             
         </div>

     `;
}
const optionTemplate = (option) => html`
    <option value=${option}>${option}</option>
`;

const loadTableTemplate = (authToken,date) => html`
${until(tableTemplate2(authToken,date),loaderTemplate())}
`;

async function tableTemplate2(authToken,date) {
    const data = await getConfirmedOrdersByDate({
        authToken,
        date
    })
    let total = 0;
    Array.from(data)
        .forEach(line => total += line.price);

  return html`
    <h2>Резултат:</h2>
    <div class="table">

        <div class="row header">
            <div class="cell">
                Име: <p></p>
            </div>
            <div class="cell">
                Брой: <p></p>
            </div>
            <div class="cell">
                Дата на поръчката:<p></p>
            </div>
            <div class="cell">
                Цена: <p></p>
            </div>
        </div>


        ${data.map(rowTemplate)}
        ${totalPriceTemplate(total)}

        </section>
`;
}

const rowTemplate = (data) => html`
    <div class="row">
        <div class="cell">
            ${data.foodName}
        </div>
        <div class="cell">
            ${data.foodCount}
        </div>
        <div class="cell">
            ${data.confirmDate}
        </div>
        <div class="cell">
            <span id="total-price">Общо: ${(data.price).toFixed(2)} лв.</span>
        </div>
    </div>
`;
const totalPriceTemplate = (total) => html`
    <div class="row">
        <div class="cell">
        </div>
        <div class="cell">
        </div>
        <div class="cell">
        </div>
        <div class="cell" id="total-price-cell">
            <span id="total-price">Общо: ${total.toFixed(2)} лв.</span>
        </div>
    </div>
`;

export async function confPage(context) {

        context.render(confTemplate(onClick));

    async function onClick(ev) {
        ev.preventDefault();
        const input = ev.target.parentNode.querySelector('#date');
        const authToken = sessionStorage.getItem('authToken');
        const date = input.value;
        try {
          const table =  document.querySelector('#table')
            render(loadTableTemplate(authToken,date),table);
        } catch (e) {
            notify(e.message);
        }
    }



}