import {createAction, createReducer} from '@reduxjs/toolkit';
import {getDefaultState, getDefaultHandler} from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarLogin = createAction('service/auth/login', data => ({
    payload: CalendarService.logIn(data),
}));

export const calendarAddUser = createAction('service/auth/add', data => ({
    payload: CalendarService.addUser(data),
}));

const initState = {
    add: getDefaultState(),
    login: getDefaultState(),
};

export default createReducer(initState, {
    ...getDefaultHandler(calendarAddUser, 'add'),
    ...getDefaultHandler(calendarLogin, 'login'),
});
