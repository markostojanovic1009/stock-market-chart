export default function messages(state = {}, action) {
  switch (action.type) {
    case 'CLEAR_MESSAGES':
      return {};
    default:
      return state;
  }
}
