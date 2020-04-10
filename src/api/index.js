import {defaultPath, methods} from "../Utils/constants";

export function getBdaysList() {
    return getFetch('/bdays', methods.GET
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
    return getFetch('/bdays/' + id, methods.PUT,data);
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
    return getFetch('/templates/' + id, methods.PUT,data);
}

export function getTemplateWithBday(templateId, bdayId) {
    return getFetch('/templates/'+ templateId + '/' + bdayId, methods.GET
    ).then(res => res.json()
    ).catch(err => err);
}

export function getFetch(path, method, data) {
    let options = {};
    options.method = method;
    if (method === methods.POST || method === methods.PUT) {
        options.body = JSON.stringify(data);
        options.headers = {
            'Content-Type': 'application/json'
        }
    }
    return fetch(defaultPath + path, options)
        .then(res => res)
        .catch(err => err);
}