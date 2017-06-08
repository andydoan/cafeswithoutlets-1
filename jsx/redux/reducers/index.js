import { combineReducers } from 'redux';

import generalReducer from './general.js';

export default combineReducers({
  GENERAL: generalReducer
});
