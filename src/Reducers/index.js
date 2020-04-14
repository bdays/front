import { combineReducers } from '@reduxjs/toolkit';
import birthdays from './birthdays';
import templates from './templates';

export default combineReducers({
  birthdays,
  templates,
});
