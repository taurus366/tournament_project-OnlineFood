import {html} from '../lib.js';
import {getOrders, editQuantityProduct, postOrder} from '../api/data.js';

const shoppingCartTemplate = (orders) => html`
    <div class="shopping-cart">
        <!-- Title -->
        <div class="title">
            Кошница
        </div>
        ${orders.length > 0 ? orders.map(productTemplate) : html`<p style="text-align: center">Кошницата ви е
            празна!</p>`}
    </div>
    <div class="btn2">
        ${orders.length > 0 ? html`
            <button class="orderBtn" type="button">Поръчай</button>` : ''}
    </div>
`;

const productTemplate = (order) => html`
    <div class="item">
        <div class="buttons">
            <span id="delete-btn" class="delete-btn"><i id="delete-btn" class="fas fa-times"></i></span>
            <span id="delete-btn" class="like-btn"></span>
        </div>

        <div class="image">
            <img id="shop" src=${order.food.imageUrl} alt=""/>
        </div>

        <div class="description">
            
            <span id="food-name">${order.food.name}</span>
         
        </div>

        <div class="quantity">
            <button id="plus-btn" class="plus-btn" type="button" name="button">
                <img id="shop" src="../cartImages/plus.svg" alt=""/>
            </button>
            <input type="text" name="name" value=${order.foodCount}>
            <button id="minus-btn" class="minus-btn" type="button" name="button">
                <img id="shop" src="../cartImages/minus.svg" alt=""/>
            </button>
        </div>
        
        <div class="price" id=${order.food.price}>Цена:</div>
        <div class="total-price">${(order.food.price * order.foodCount).toFixed(2)}</div>
        <div class="price right">лв.</div>
        <p> <textarea readonly id="food-comment" style="resize: none" >${order.comment.trim()}</textarea> </p>
        <div class="product-id" id=${order.food.id}></div>
        <div class="cart-id" id=${order.id}></div>
    </div>
`;

export async function shoppingCartPage(context) {
    const authToken = sessionStorage.getItem('authToken');
    await makeCallGetOrdersAndRender();


    async function makeCallGetOrdersAndRender() {
        if (authToken !== null) {
            const orders = await getOrders({"session": {authToken}});
            context.render(shoppingCartTemplate(orders));
        }
    }


    document.querySelector('.shopping-cart').addEventListener('click', onClick);
    document.querySelector('.btn2 > .orderBtn').addEventListener('click', onSubmit);

    async function onSubmit(ev) {
        const authToken = sessionStorage.getItem('authToken');
        try {
            notify(await postOrder({authToken}));
            await makeCallGetOrdersAndRender();

        } catch (e) {
            notify(e.message);
        }

    }

    async function onClick(ev) {
        let type = '';
        const parrent = ev.target.parentNode.parentNode.querySelector('.description') != null ? ev.target.parentNode.parentNode : ev.target.parentNode.parentNode.parentNode;
        let quantity = parrent.querySelector('.quantity > input').value;

        // const comment = parrent.querySelector('.food-comment').value;
        // const productId = parrent.querySelector('.product-id').id;
        const cartId = parrent.querySelector('.cart-id').id;
        let price = parrent.querySelector('.total-price').textContent;
        if (ev.target.id === 'delete-btn') {
            type = 'delete';

        } else if (ev.target.id === 'plus-btn' || ev.target.parentNode.id === 'plus-btn') {
            type = 'plus';
        } else if (ev.target.id === 'minus-btn' || ev.target.parentNode.id === 'minus-btn') {
            if (parseInt(parrent.querySelector('.quantity > input').value) >= 2) {
                type = 'minus';
            }

        }
        const option = {
            // "comment": comment,
            "session": {"authToken": authToken},
            // "id": productId,
            "cartId": cartId,
            "type": type
        };
        if (type.length > 0) {
            try {
                notify(await editQuantityProduct(option));

                if (type === 'plus') {
                    parrent.querySelector('.quantity > input').value = parseInt(quantity) + 1;
                  // await makeCallGetOrdersAndRender();
                  //   console.log(parseFloat(parrent.querySelector('.price').id).toFixed(2))
                } else if (type === 'minus') {
                   parrent.querySelector('.quantity > input').value = parseInt(quantity) - 1;
                   // await makeCallGetOrdersAndRender();
                }
                if (type === 'delete') {
                  // parrent.parentNode.removeChild(parrent);
                    await makeCallGetOrdersAndRender();
                } else {
                   parrent.querySelector('.total-price').textContent = (parseFloat(parrent.querySelector('.price').id).toFixed(2) * parseFloat(parrent.querySelector('.quantity > input').value).toFixed(2)).toFixed(2);
                }


            } catch (e) {
                notify(e.message);
            }
        }

    }



}