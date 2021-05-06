import {render,page} from './lib.js';
import {logout} from './api/data.js';


import {homePage} from "./views/home.js";
import {catalogPage} from "./views/catalog.js";
import {loginPage} from "./views/login.js";
import {registerPage} from "./views/register.js";
import {profilePage} from "./views/profile.js";
import {detailsPage} from "./views/details.js";
import {createPage} from "./views/admin/create.js";
import {shoppingCartPage} from "./views/shoppingCart.js";
import {notify} from './notification.js';
import {editFoodPage} from "./views/admin/edit.js";
import {orderPage} from "./views/admin/order.js";
import {confPage} from "./views/admin/confirmedOrders.js";

const main = document.querySelector('main');

document.querySelector('#logout').addEventListener('click',(ev) => {
    ev.preventDefault();
    logout();
    setUserNav();
    page.redirect('/');
});



page('/' , decorateContext, guestUserOnly, homePage);
page('/register', decorateContext, registerPage);
page('/login', decorateContext, loginPage);
page('/profile', decorateContext, profilePage)
page('/catalog', decorateContext, catalogPage);
page('/details/:id', decorateContext, detailsPage);
page('/edit/:id', decorateContext, editFoodPage);
page('/admin/create', decorateContext, createPage)
page('/admin/orders', decorateContext, orderPage)
page('/admin/conforders', decorateContext, confPage);
page('/cart', decorateContext, shoppingCartPage);
page.start();
setUserNav();

function decorateContext(context,next) {
    context.render = (content) => render(content,main);
    context.setUserNav = setUserNav;
    addOrRemoveActive(context.page.current.substring(1));
    next();
}




function setUserNav() {
    const token = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');
    const fullName = sessionStorage.getItem('fullName');
    const userRole  =sessionStorage.getItem('role');

    if (userRole === 'ADMIN'){
        document.querySelector('#create').style.display = 'block';
        document.querySelector('#orders').style.display = 'block';
        document.querySelector('#cart').style.display = 'none';
        document.querySelector('#profile').style.display = 'none';
        document.querySelector('#confirm-orders').style.display = 'block';
    }else {
        document.querySelector('#create').style.display = 'none';
        document.querySelector('#orders').style.display = 'none';
        document.querySelector('#cart').style.display = 'block';
        document.querySelector('#profile').style.display = 'block';
        document.querySelector('#confirm-orders').style.display = 'none';
    }

    if (token !== null){
        document.querySelector('.guest').style.display = 'none';
        document.querySelector('.user > .profile').firstElementChild.textContent = `Здравейте, ${fullName}`;
        document.querySelector('.user').style.display = 'block';
    }else {
        document.querySelector('.guest').style.display = 'block';
        document.querySelector('.user').style.display = 'none';
    }


}

function guestUserOnly(context,next) {
    const token = sessionStorage.getItem('authToken');
    if(token !== null){
        return context.page.redirect('/catalog');
    }
    next();
}

function addOrRemoveActive(where) {
    if (where === 'login' || where === 'register' || where === '' || where === 'catalog' || where === 'profile' || where === 'admin/create' || where === 'cart' || where === 'admin/orders' || where === 'admin/conforders'){
        if (where.length === 0){
            where = 'begin';
        }else
        if (where === 'admin/create'){
            where = 'create';
        }else
        if (where === 'admin/orders'){
            where = 'orders';
        }else
        if (where === 'admin/conforders'){
            where = 'confirm-orders';
        }

        document.querySelector(`#${where}`).classList.add('active');
        Array.from(document.querySelectorAll('a'))
            .filter(line => line.id !== where)
            .forEach(line2 => line2.classList.remove('active'));
    }else {
        Array.from(document.querySelectorAll('a'))
            .forEach(line2 => line2.classList.remove('active'));
    }




}