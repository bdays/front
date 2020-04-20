import { createAction, createReducer } from '@reduxjs/toolkit';
import { getDefaultState, getDefaultHandler } from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarFetchListOfChannels = createAction('service/slack/fetchChannels', () => ({
    payload: CalendarService.fetchListOfChannels(),
}));

const initState = {
    listOfChannels: getDefaultState(),
};

export default createReducer(initState, {
    ...getDefaultHandler(calendarFetchListOfChannels, 'listOfChannels'),
});
