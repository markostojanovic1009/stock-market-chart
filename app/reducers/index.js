import { combineReducers } from 'redux';
import messages from './messages';
import stocks from './stocks';

export default combineReducers({
  messages,
  stocks
});
