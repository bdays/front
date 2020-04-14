import { createAction, createReducer } from '@reduxjs/toolkit';
import { getDefaultState, getDefaultHandler } from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarFetchUser= createAction('service/users/fetch', () => ({
    payload: CalendarService.fetchUser(),
}));

const initState = {
    currentUser: getDefaultState(),
};

export default createReducer(initState, {
    ...getDefaultHandler(calendarFetchUser, 'currentUser'),
});
