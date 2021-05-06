import {html,until} from "../../lib.js";
import {getAllOrders,confirmOrDeleteOrder} from '../../api/data.js';
import {loaderTemplate} from '../../common/loader.js';

const loadTable = (data) => html`
    ${data.length > 0 ? data.map(table2Template) : html`
        <div class="no-order">Няма поръчки все още</div>`}
`;







// const tableTemplate = (data) => html`
//   ${until(loadTable(data),loaderTemplate())}
// `;

const table2Template = (data) => html`
    <div class="table">
        <div class="row header">
            <div class="cell">
                Име: <p>${data.fullName}</p>
            </div>
            <div class="cell">
                Тел номер: <p>${data.phoneNumber}</p>
            </div>
            <div class="cell">
                Адрес:<p>${data.address}</p>
            </div>
            <div class="cell">
                Дата на поръчката: <p>${data.orderTime}</p>
            </div>
        </div>
        <div class="row random">
            <div class="cell">
                Име:
            </div>
            <div class="cell">
                Брой:
            </div>
            <div class="cell">
                Коментар:
            </div>
            <div class="cell">
                Цена:
            </div>
        </div>
        ${data.orders.map(rowTemplate)}
        <div class="row">
            <div class="cell">
            </div>
            <div class="cell">
            </div>
            <div class="cell">
            </div>
            <div class="cell" id="total-price-cell">
                <span id="total-price">Общо: ${data.totalPrice} лв.</span>
            </div>
        </div>
        <div class="btn-confirm" id=${data.username}>
            <button id="confirm-btn">Приеми поръчката</button>
            <button id="delete-btn">Изтрий поръчката</button>
        </div>
    </div>
`;

const rowTemplate = (data) => html`
    <div class="row">
        <div class="cell">
            ${data.food.name}
        </div>
        <div class="cell">
            ${data.foodCount}
        </div>
        <div class="cell">
            
            <textarea id="comment" readonly style="resize: none" >  ${data.comment}</textarea>
        </div>
        <div class="cell">
            ${(data.foodCount * parseFloat(data.food.price).toFixed(2)).toFixed(2)}
        </div>
    </div>
`;

export async function orderPage(context) {
    const authToken = sessionStorage.getItem('authToken');
    let orders = null;
    let order = [];
    await renderThePage();

    async function renderThePage() {
        if (authToken !== null){
            try {
                orders = await getAllOrders({authToken});
                Object.entries(orders)
                    .forEach(([k, v]) => {
                        let data = {};
                        data['fullName'] = v[0].fullName;
                        data['orders'] = v;
                        data['username'] = k;

                        let totalPrice = 0;
                        v
                            .forEach(value => {
                                data['phoneNumber'] = value.phoneNumber;
                                data['address'] = value.address;
                                data['orderTime'] = value.orderDate;
                                totalPrice += value.foodCount * value.price;

                            })
                        data['totalPrice'] = totalPrice.toFixed(2);
                        order.push(data);
                    })
            } catch (e) {
                notify(e.message);
            }
            context.render(loadTable(order));
            order = [];
        }
    }

     document.querySelector('.btn-confirm').addEventListener('click', onClick);

    async function onClick(ev) {
        let option = {};
        ev.preventDefault();
        if (ev.target.id === 'delete-btn' || ev.target.id === 'confirm-btn') {
            const type = ev.target.id;
            const username = ev.target.parentNode.id;
            option['type'] = type;
            option['username'] = username;
            option['authToken'] = authToken;
            try {
                notify(await confirmOrDeleteOrder(option));
                await renderThePage();
            }catch (e) {
                notify(e.message);
            }

        }
    }
}