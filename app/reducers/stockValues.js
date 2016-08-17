const initialState = {
    isFetching: false,
    items: []
};
export default function stockValues(state=initialState, action) {
    switch(action.type) {
        case "FETCH_STOCK_VALUES":
            return Object.assign({}, state, {isFetching: true});
        case "RECEIVE_STOCK_VALUES_SUCCESS":
            return Object.assign({}, state, {
                isFetching: false,
                items: action.stockValues.slice()
            });
        default:
            return state;
    }
}