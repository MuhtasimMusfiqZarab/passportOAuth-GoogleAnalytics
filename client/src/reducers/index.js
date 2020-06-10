import { combineReducers } from 'redux';
import authReducer from './authReducer';
import analyticsReducer from './analyticsReducer';

export default combineReducers({
  auth: authReducer,
  analytics: analyticsReducer,
});
