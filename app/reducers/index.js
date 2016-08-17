import { combineReducers } from 'redux';
import messages from './messages';
import stocks from './stocks';
import stockValues from './stockValues';
export default combineReducers({
  messages,
  stocks,
  stockValues
});
