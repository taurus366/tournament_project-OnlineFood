import {html} from "../../lib.js";
import {getAllOrders,confirmOrDeleteOrder} from '../../api/data.js';


// const ordersTemplate = (orders) => html`
//     <div class="shopping-cart">
//         <!-- Title -->
//         <div class="title">
//             Поръчки , ${orders.length}
//         </div>
//        <div class="item">
// <!--        <div class="buttons">-->
// <!--            <span id="delete-btn" class="delete-btn"><i id="delete-btn" class="fas fa-times"></i></span>-->
// <!--            <span id="delete-btn" class="like-btn"></span>-->
// <!--        </div>-->
//
// <!--        <div class="image">-->
// <!--            <img id="shop" src=test alt=""/>-->
// <!--        </div>-->
//
//         <div class="description">
//             <span>test</span>
//             <span>test</span>
//             <span>test</span>
//         </div>
//
// <!--        <div class="quantity">-->
// <!--            <button id="plus-btn" class="plus-btn" type="button" name="button">-->
// <!--                <img id="shop" src="../cartImages/plus.svg" alt=""/>-->
// <!--            </button>-->
// <!--            <input type="text" name="name" value=test>-->
// <!--            <button id="minus-btn" class="minus-btn" type="button" name="button">-->
// <!--                <img id="shop" src="../cartImages/minus.svg" alt=""/>-->
// <!--            </button>-->
// <!--        </div>-->
//         <div class="price" id=test>Цена:</div>
//         <div class="total-price">test</div>
//         <div class="price right">лв.</div>
//         <div class="product-id" id=test></div>
//     </div>
//     </div>
// <!--    <div class="btn2">-->
//     <!--        <button class="orderBtn" type="button">Поръчай</button>-->
//     <!--    </div>-->
// `;
//
// // const productTemplate = (order) => html`
// //     <div class="item">
// //         <div class="buttons">
// //             <span id="delete-btn" class="delete-btn"><i id="delete-btn" class="fas fa-times"></i></span>
// //             <span id="delete-btn" class="like-btn"></span>
// //         </div>
// //
// //         <div class="image">
// //             <img id="shop" src=${order.food.imageUrl} alt=""/>
// //         </div>
// //
// //         <div class="description">
// //             <span>${order.food.name}</span>
// //             <span>${order.food.description}</span>
// //             <span>${order.comment}</span>
// //         </div>
// //
// //         <div class="quantity">
// //             <button id="plus-btn" class="plus-btn" type="button" name="button">
// //                 <img id="shop" src="../cartImages/plus.svg" alt=""/>
// //             </button>
// //             <input type="text" name="name" value=${order.foodCount}>
// //             <button id="minus-btn" class="minus-btn" type="button" name="button">
// //                 <img id="shop" src="../cartImages/minus.svg" alt=""/>
// //             </button>
// //         </div>
// //         <div class="price" id=${order.food.price}>Цена:</div>
// //         <div class="total-price">${(order.food.price * order.foodCount).toFixed(2)}</div>
// //         <div class="price right">лв.</div>
// //         <div class="product-id" id=${order.food.id}></div>
// //     </div>
// // `;
//
// export async function orderPage(context){
//     const authToken = sessionStorage.getItem('authToken');
//     let orders = null;
//     try {
//
//         if (authToken != null){
//             orders =  await getAllOrders();
//         }
//     }catch (e) {
//         notify(e.message);
//     }
//
//     context.render(ordersTemplate(orders));
//
//
// }

const tableTemplate = (data) => html`

    ${data.length > 0 ? data.map(table2Template) : html`
        <div class="no-order">Няма поръчки все още</div>`}


`;

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
            <div class="cell">
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
    await renderThePage(order);
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
          context.render(tableTemplate(order));
          order = [];
      }
    }




    //  console.log(orders)




   document.querySelector('main').addEventListener('click', onClick);

    async function onClick(ev) {
        let option = {};

        if (ev.target.id === 'delete-btn' || ev.target.id === 'confirm-btn') {
            const type = ev.target.id;
            const username = ev.target.parentNode.id;
            // console.log(ev.target.id);
            option['type'] = type;
            option['username'] = username;
            option['authToken'] = authToken;
        try {
            notify(await confirmOrDeleteOrder(option));
            await renderThePage(order);
        }catch (e) {
           notify(e.message);
        }

        }
    }
}