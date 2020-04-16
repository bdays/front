import { createAction, createReducer } from '@reduxjs/toolkit';
import { getDefaultState, getDefaultHandler } from '../Utils/reduxTools';
import CalendarService from '../Services/CalendarService';

export const calendarFetchListOfBdays = createAction('service/bdays/list', () => ({
  payload: CalendarService.fetchListOfBdays(),
}));

export const calendarFetchBday = createAction('service/bdays/bday', (id) => ({
  payload: CalendarService.fetchBday(id),
}));

export const calendarDeleteBday = createAction('service/bdays/delete', id => ({
  payload: CalendarService.deleteBday(id),
}));

export const calendarAddBday = createAction('service/bdays/add', data => ({
  payload: CalendarService.addBday(data),
}));

export const calendarEditBday = createAction('service/bdays/edit', (id,data) => ({
  payload: CalendarService.editBday(id,data),
}));

export const calendarFetchListOfChannels = createAction('service/bdays/fetchChannels', () => ({
  payload: CalendarService.fetchListOfChannels(),
}));

const initState = {
  list: getDefaultState(),
  delete: getDefaultState(),
  add: getDefaultState(),
  edit: getDefaultState(),
  listOfChannels: getDefaultState(),
  bday: getDefaultState(),
};

export default createReducer(initState, {
  ...getDefaultHandler(calendarFetchListOfBdays, 'list'),
  ...getDefaultHandler(calendarDeleteBday, 'delete'),
  ...getDefaultHandler(calendarAddBday, 'add'),
  ...getDefaultHandler(calendarEditBday, 'edit'),
  ...getDefaultHandler(calendarFetchListOfChannels, 'listOfChannels'),
  ...getDefaultHandler(calendarFetchBday, 'bday'),
});
