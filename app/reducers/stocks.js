const initialState = {
    isFetching: false,
    items: []
};
export default function stocks(state=initialState, action) {
    switch(action.type) {
        case "FETCH_STOCKS":
            return Object.assign({}, state, {isFetching: true});
        case "RECEIVE_STOCKS_SUCCESS":
            return Object.assign({}, state, {
                isFetching: false,
                items: action.stocks.slice()
            });
        case "ADD_STOCK_SUCCESS":
            return Object.assign({}, state, {
                isFetching: false,
                items: [...state.items, action.stock]
            });
        case "REMOVE_STOCK_SUCCESS":
            return Object.assign({}, state, {
               items: state.items.filter((item) => {
                   return item.id !== action.stockId
               })
            });
        case "NOTIFY_STOCK_ADDED":
            return Object.assign({}, state);
        default:
            return state;
    }
}