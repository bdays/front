import { createAction, createReducer } from '@reduxjs/toolkit';
import { getDefaultState, getDefaultHandler } from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarFetchListOfChannels = createAction('service/slack/fetchChannels', () => ({
    payload: CalendarService.fetchListOfChannels(),
}));

export const calendarSendTestMessage = createAction('service/slack/testMessage', (data) => ({
    payload: CalendarService.sendTestMessage(data),
}));


const initState = {
    listOfChannels: getDefaultState(),
    testMessage: getDefaultState(),
};

export default createReducer(initState, {
    ...getDefaultHandler(calendarFetchListOfChannels, 'listOfChannels'),
    ...getDefaultHandler(calendarSendTestMessage, 'testMessage'),
});
