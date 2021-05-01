import * as api from './api.js';

 // const host = 'http://localhost:8080';
//const host = 'http://77.71.76.17:3030';
//onst host = 'http://127.0.0.1:8081/http://localhost:8080';
//const host = 'http://192.168.0.100:8081/http://192.168.0.100:8080';
const host = 'http://77.71.76.17:8081/http://77.71.76.17:8080'
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;



export async function getAllFoods() {
    return await api.get(host +'/foods');
}
export async function getFoodById(id) {
    return await api.get(host + '/foods/' + id)
}
export async function deleteFoodByID(id,data) {
    return await api.del(host + '/foods/' + id,data);
}

export async function editProfile(data) {
  const result = await api.put(host + '/users/change/information', data);
    sessionStorage.setItem('address',result.address);
    sessionStorage.setItem('phoneNumber',result.phoneNumber);
    sessionStorage.setItem('fullName',result.fullName);
    return result
}
export async function postFood(data) {
    return await api.post(host + '/foods/add', data);
}
export async function editFood(data) {
    return await api.put(host + '/foods/add2', data);
}
export async function addCart(data) {
    return await api.post(host + '/cart/post' , data);
}
export async function getOrders(data) {
    return await api.post(host + '/cart/get',data);
}
export async function editQuantityProduct(data) {
    return await api.put(host + '/cart/put',data)
}
export async function postOrder(data) {
    return await api.post(host + '/order/post',data);
}
export async function getAllOrders(data) {
    return await api.post(host + '/order/get',data);
}
export async function confirmOrDeleteOrder(data) {
    return await api.del(host + '/order/delete',data);
}
export async function getConfirmedOrdersByDate(data) {
    return await api.post(host + '/confirm/confirmed',data);
}
