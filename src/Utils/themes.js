import {themeNames} from "./constants";

export function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}


export function getTheme() {
    if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
    } else {
        return themeNames.default;
    }
}