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
        default:
            return state;
    }
}