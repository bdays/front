import {dateFormat, isAllowedDate} from "./date";

export const regForName = new RegExp('^[a-zA-Zа-яА-Я-]{2,30}$');
export const regForDate = new RegExp(/^\d{1,2}\/\d{1,2}\/\d{4}$/);

const emptyErr = 'the field cannot be empty!';
const incorrectErr = 'incorrect value';

function isEmpty(field) {
    return (field.length < 1);
}

export function isValidationSuccessful(errObj) {
    for (const key in errObj) {
        if (errObj[key]) return false;
    }
    return true;
}

export function nameValidation(name) {
    let err = '';
    err = regForName.test(name) ? '' : incorrectErr;
    err = isEmpty(name) ? emptyErr : err;
    return err;
}

export function dateOfBdayValidation(date) {
    let err = '';
    if (regForDate.test(date)) {
        if (!isAllowedDate(date)) {
            err = incorrectErr;
        }
    } else {
        err = incorrectErr + ' (date format: ' + dateFormat + ')';
    }
    err = isEmpty(date) ? emptyErr : err;
    return err;
}

export function titleValidation(title) {
    let err = '';
    err = isEmpty(title) ? emptyErr : err;
    return err;
}

export function blocksValidation(blocks) {
    let error = {err: '', blocks: []};
    error.err = isEmpty(blocks) ? emptyErr : error.err;

    try {
        let per = JSON.parse(blocks);
        if (per['blocks']) {
            error.blocks=per.blocks;
        }else{//если поля blocks нет в объекте
            error.blocks=per;
        }

    } catch (e) {
        error.err = 'JSON error';
    }

    return error;
}



