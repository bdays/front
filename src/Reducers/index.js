import { combineReducers } from '@reduxjs/toolkit';
import birthdays from './birthdays';
import templates from './templates';
import users from './users';

export default combineReducers({
  birthdays,
  templates,
  users,
});
