export function getAllStocks() {
    return (dispatch) => {
        dispatch({
            type: "CLEAR_MESSAGES"
        });
        dispatch({
            type: 'FETCH_STOCKS'
        });
        return fetch('/api/stock', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return response.json().then((json) => {
               if(response.ok) {
                   dispatch({
                       type: 'RECEIVE_STOCKS_SUCCESS',
                       stocks: json
                   });
               } else {
                   dispatch({
                       type: 'RECEIVE_STOCKS_FAILURE',
                       msg: json
                   });
               }
            });
        });
    };
}

export function getAllStockValues() {
    return (dispatch) => {
        dispatch({
            type: 'FETCH_STOCK_VALUES'
        });
        return fetch('/api/stock/values/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
           return response.json().then((json) => {
               if(response.ok) {
                   dispatch({
                       type: 'RECEIVE_STOCK_VALUES_SUCCESS',
                       stockValues: json
                   });
               } else {
                   dispatch({
                       type: 'RECEIVE_STOCK_VALUES_FAILURE',
                       msg: json
                   });
               }
           });
        });
    };
}