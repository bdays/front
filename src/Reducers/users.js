import {createAction, createReducer} from '@reduxjs/toolkit';
import {getDefaultState, getDefaultHandler} from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarAddUser = createAction('service/auth/add', data => ({
    payload: CalendarService.addUser(data),
}));
//
// export const calendarEditPassword = createAction('service/auth/edit', (id, data) => ({
//     payload: CalendarService.editPassword(data),
// }));

const initState = {
    add: getDefaultState(),
};

export default createReducer(initState, {
    ...getDefaultHandler(calendarAddUser, 'add'),
});
