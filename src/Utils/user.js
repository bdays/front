import {getCurrentDateInUNIX} from "./date";

export function isUserLoggedIn() {
    if (localStorage.getItem('token')) {
        const tokenLifetime = (localStorage.getItem('token')).split(".")[1];
        return (JSON.parse(atob(tokenLifetime)).exp > getCurrentDateInUNIX());
    } else {
        return false;
    }
}

export function userLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.userName);
}

export function userLogon() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
}