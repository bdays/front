import {defaultPath, methods} from "../Utils/constants";

export function getBdaysList() {
    return getFetch('/bdays', methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function getBday(id) {
    return getFetch('/bdays/' + id, methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function addBday(data) {
    return getFetch('/bdays', methods.POST, data);
}

export function deleteBday(id) {
    return getFetch('/bdays/' + id, methods.DELETE);
}

export function editBday(id, data) {
    return getFetch('/bdays/' + id, methods.PUT, data);
}

export function getChannelsList() {
    return getFetch('/slack/channel_list', methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}


export function getTemplatesList() {
    return getFetch('/templates', methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function addTemplate(data) {
    return getFetch('/templates', methods.POST, data);
}

export function deleteTemplate(id) {
    return getFetch('/templates/' + id, methods.DELETE);
}

export function getTemplate(id) {
    return getFetch('/templates/' + id, methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function editTemplate(id, data) {
    return getFetch('/templates/' + id, methods.PUT, data);
}

export function getTemplateWithBday(templateId, bdayId) {
    return getFetch('/templates/' + templateId + '/' + bdayId, methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function getToken(data) {
    return getFetch('/auth/login', methods.POST, data
    ).then(res => res.json()
    ).catch(err => console.log(err));
}

export function addUser(data) {
    return getFetch('/auth/create_new_user', methods.POST, data
    ).then(res => res.json()
    ).catch(err => console.log(err));
}

export function editPassword(data) {
    return getFetch('/auth/change_password', methods.PUT, data);
}


export function getFetch(path, method, data) {
    let options = {};
    options.method = method;
    options.headers = {};
    if (localStorage.getItem('token')) {
        options.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
    if (method === methods.POST || method === methods.PUT) {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }
    return fetch(defaultPath + path, options)
        .then(res => res)
        .catch(err => console.log(err));
}
