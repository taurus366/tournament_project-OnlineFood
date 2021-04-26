

export const settings = {
    host:''
}

async function request(url, options) {



     try {
        const response = await fetch(url,options);

        if (response.ok === false) {
            const err = await response.json();
            throw new Error(err);
        }
       try {
           const data = await response.json();
           console.log(data)
           return data;
       }
       catch (err) {
           throw err;
       }
    } catch (err) {
    //     console.log(err.message)
        throw err;
    }
 }

function getOptions(type,body) {
    const options = {

        method: type,
        headers: {"X-Requested-With": "XMLHttpRequest"}
    };
    const token = sessionStorage.getItem('authToken');
    if (token != null) {
        options.headers['X-Authorization'] = token;
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    return options;
}

export async function get(url) {
    return await request(url, getOptions())
}

export async function post(url, data) {
    return await request(url, getOptions('post', data))
}

export async function put(url, data) {
   const result = await request(url, getOptions('put', data));
   return result;
}

export async function del(url, data) {
    return await request(url, getOptions('delete',data));
}

export async function login(username , password) {
   const result =  await post(settings.host + '/users/login', {username,password});

   await setItemsSessionStorage(result);

    return result;
}

export async function register(username, password, address, fullName, phoneNumber) {
    const result =  await post(settings.host + '/users/register', {username,password,address,fullName,phoneNumber});
  await  setItemsSessionStorage(result);

    return result;
}

export async function logout(email , password) {
  //  const result =  await get(settings.host + '/users/logout');

   // sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('phoneNumber');
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
   // return result;
}
async function setItemsSessionStorage(result) {
    sessionStorage.setItem('username',result.username);
    sessionStorage.setItem('address',result.address);
    sessionStorage.setItem('phoneNumber',result.phoneNumber);
    sessionStorage.setItem('fullName',result.fullName);
    sessionStorage.setItem('authToken',result.session.authToken);
    sessionStorage.setItem('userId',result.id);
    sessionStorage.setItem('role',result.role);
}