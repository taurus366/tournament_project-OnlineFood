import {html} from '../../lib.js';
import {getConfirmedOrdersByDate} from '../../api/data.js';

let totalPrice = 0;
const confTemplate = (data,total) =>html`
    <section id="search-turnover-by-day">
        <h1>Филтрирай по дата</h1>

        <div class="container">
            <input type="date" id="start" name="trip-start"
                   value="2018-07-22"
                   min="2021-01-01" max="2022-12-31">
            <button class="button  search">Търси</button>
        </div>

      
            <!-- Display all records -->
          
        ${data != null && data.length > 0 ? tableTemplate(data,total) : '' }
        
 
`;

const tableTemplate = (data,total) => html`
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

const rowTemplate = (data) =>html`
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
            <span id="total-price">Общо: ${(data.foodCount * data.price).toFixed(2)} лв.</span>
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
        <div class="cell">
            <span id="total-price">Общо: ${total} лв.</span>
        </div>
    </div>
`;
// <input id="search-input" type="text" name="search" placeholder="Enter desired production year" >

export async function confPage(context) {

    context.render(confTemplate());
    document.querySelector('.search').addEventListener('click',onClick);

    async function onClick(ev) {
      const input =  ev.target.parentNode.querySelector('input');
        const authToken = sessionStorage.getItem('authToken');
        const date = input.value;
       try {
        const data = await getConfirmedOrdersByDate({
               authToken,
               date
           })
           let total = 0;
          Array.from(data)
             .forEach(line =>total += (line.price * line.foodCount));

           context.render(confTemplate(data,total.toFixed(2)));
       }catch (e) {
           notify(e.message);
       }
    }


}