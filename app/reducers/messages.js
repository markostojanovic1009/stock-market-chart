export default function messages(state = {}, action) {
  switch (action.type) {
    case 'CLEAR_MESSAGES':
      return {};
    case 'ADD_STOCK_FAILURE':
      return Object.assign({}, state, {
        error: action.msg
      });
    default:
      return state;
  }
}
